import { z } from "zod";

import { demoOrders, serviceCategorySeeds } from "@/lib/mock-data";
import { getPrismaClient } from "@/lib/prisma";
import type {
  BookingFormValues,
  OrderRecord,
  OrderStatus,
  ServiceCategoryRecord,
} from "@/lib/types";
import { generateOrderNumber } from "@/lib/utils";

const bookingSchema = z.object({
  fullName: z.string().min(1),
  phone: z.string().min(6),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().min(8),
  notes: z.string().optional(),
  categoryId: z.string().min(1),
  itemName: z.string().min(1),
  quantity: z.number().int().min(1),
  extraServices: z.string().optional(),
});

type InMemoryStore = {
  orders: OrderRecord[];
};

const globalStore = globalThis as {
  washCareStore?: InMemoryStore;
};

function getStore() {
  if (!globalStore.washCareStore) {
    globalStore.washCareStore = {
      orders: [...demoOrders],
    };
  }

  return globalStore.washCareStore;
}

function shouldUseDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

function mapCategory(category: {
  id: string;
  name: string;
  description: string;
  seoSlug: string;
  basePrice: number;
}): ServiceCategoryRecord {
  return category;
}

function mapOrder(order: {
  id: string;
  orderNumber: string;
  totalAmount: number;
  pickupAddress: string;
  notes: string | null;
  status: OrderStatus;
  createdAt: Date;
  user: {
    id: string;
    fullName: string | null;
    phone: string | null;
    email: string | null;
  };
  items: Array<{
    id: string;
    itemName: string;
    quantity: number;
    unitPrice: number;
    extraServices: string | null;
    serviceCategory: {
      id: string;
      name: string;
      description: string;
      seoSlug: string;
      basePrice: number;
    };
  }>;
}): OrderRecord {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    totalAmount: order.totalAmount,
    pickupAddress: order.pickupAddress,
    notes: order.notes,
    status: order.status,
    createdAt: order.createdAt.toISOString(),
    user: order.user,
    items: order.items.map((item) => ({
      id: item.id,
      itemName: item.itemName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      extraServices: item.extraServices,
      serviceCategory: mapCategory(item.serviceCategory),
    })),
  };
}

async function ensureSeededCategories() {
  const prisma = getPrismaClient();
  const count = await prisma.serviceCategory.count();

  if (count > 0) {
    return;
  }

  await prisma.serviceCategory.createMany({
    data: serviceCategorySeeds.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description,
      seoSlug: category.seoSlug,
      basePrice: category.basePrice,
    })),
  });
}

export async function getServiceCategories() {
  if (!shouldUseDatabase()) {
    return serviceCategorySeeds;
  }

  try {
    const prisma = getPrismaClient();
    await ensureSeededCategories();

    const categories = await prisma.serviceCategory.findMany({
      orderBy: {
        basePrice: "asc",
      },
    });

    return categories.map((category) => mapCategory(category));
  } catch {
    return serviceCategorySeeds;
  }
}

export async function createOrder(payload: BookingFormValues) {
  const input = bookingSchema.parse(payload);
  const categories = await getServiceCategories();
  const category = categories.find((item) => item.id === input.categoryId);

  if (!category) {
    throw new Error("未找到对应的服务类目");
  }

  const totalAmount = category.basePrice * input.quantity;
  const orderNumber = generateOrderNumber();

  if (!shouldUseDatabase()) {
    const store = getStore();
    const order: OrderRecord = {
      id: crypto.randomUUID(),
      orderNumber,
      totalAmount,
      pickupAddress: input.address,
      notes: input.notes,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      user: {
        id: crypto.randomUUID(),
        fullName: input.fullName,
        phone: input.phone,
        email: input.email,
      },
      items: [
        {
          id: crypto.randomUUID(),
          itemName: input.itemName,
          quantity: input.quantity,
          unitPrice: category.basePrice,
          extraServices: input.extraServices,
          serviceCategory: category,
        },
      ],
    };

    store.orders.unshift(order);
    return order;
  }

  try {
    const prisma = getPrismaClient();
    await ensureSeededCategories();

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.upsert({
        where: input.email
          ? { email: input.email }
          : {
              phone: input.phone,
            },
        update: {
          phone: input.phone,
          email: input.email || null,
          fullName: input.fullName,
        },
        create: {
          phone: input.phone,
          email: input.email || null,
          fullName: input.fullName,
        },
      });

      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: user.id,
          totalAmount,
          pickupAddress: input.address,
          notes: input.notes,
          items: {
            create: [
              {
                itemName: input.itemName,
                quantity: input.quantity,
                unitPrice: category.basePrice,
                extraServices: input.extraServices,
                serviceCategoryId: category.id,
              },
            ],
          },
        },
        include: {
          user: true,
          items: {
            include: {
              serviceCategory: true,
            },
          },
        },
      });

      return order;
    });

    return mapOrder(result);
  } catch {
    const store = getStore();
    const order: OrderRecord = {
      id: crypto.randomUUID(),
      orderNumber,
      totalAmount,
      pickupAddress: input.address,
      notes: input.notes,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      user: {
        id: crypto.randomUUID(),
        fullName: input.fullName,
        phone: input.phone,
        email: input.email,
      },
      items: [
        {
          id: crypto.randomUUID(),
          itemName: input.itemName,
          quantity: input.quantity,
          unitPrice: category.basePrice,
          extraServices: input.extraServices,
          serviceCategory: category,
        },
      ],
    };

    store.orders.unshift(order);
    return order;
  }
}

export async function getOrdersForUser(userId: string) {
  if (!shouldUseDatabase()) {
    return getStore().orders.filter((order) => order.user.id === userId);
  }

  try {
    const prisma = getPrismaClient();
    const orders = await prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        user: true,
        items: {
          include: {
            serviceCategory: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return orders.map((order) => mapOrder(order));
  } catch {
    return getStore().orders.filter((order) => order.user.id === userId);
  }
}

export async function getAllOrders() {
  if (!shouldUseDatabase()) {
    return getStore().orders;
  }

  try {
    const prisma = getPrismaClient();
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        items: {
          include: {
            serviceCategory: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return orders.map((order) => mapOrder(order));
  } catch {
    return getStore().orders;
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  if (!shouldUseDatabase()) {
    const store = getStore();
    const target = store.orders.find((order) => order.id === orderId);

    if (!target) {
      throw new Error("订单不存在");
    }

    target.status = status;
    return target;
  }

  try {
    const prisma = getPrismaClient();
    const updated = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status,
      },
      include: {
        user: true,
        items: {
          include: {
            serviceCategory: true,
          },
        },
      },
    });

    return mapOrder(updated);
  } catch {
    const store = getStore();
    const target = store.orders.find((order) => order.id === orderId);

    if (!target) {
      throw new Error("订单不存在");
    }

    target.status = status;
    return target;
  }
}
