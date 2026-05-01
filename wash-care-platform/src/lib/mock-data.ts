import type { OrderRecord, ServiceCategoryRecord } from "@/lib/types";

export const serviceCategorySeeds: ServiceCategoryRecord[] = [
  {
    id: "svc-sneakers",
    name: "运动鞋深洗",
    description: "适合网面鞋、跑鞋和日常潮鞋，包含鞋面去渍和鞋底护理。",
    seoSlug: "sneaker-care",
    basePrice: 8900,
  },
  {
    id: "svc-down-jacket",
    name: "羽绒服洗护",
    description: "轻污渍处理、蓬松恢复和局部补洗，适合冬季外套。",
    seoSlug: "down-jacket-care",
    basePrice: 12900,
  },
  {
    id: "svc-leather-bag",
    name: "高档皮具护理",
    description: "适合托特包、斜挎包和小皮件，包含基础清洁和养护。",
    seoSlug: "luxury-leather-care",
    basePrice: 18800,
  },
  {
    id: "svc-daily-laundry",
    name: "日常衣物洗护",
    description: "适合衬衫、针织、裤装等常规衣物，支持分类清洗。",
    seoSlug: "daily-garment-care",
    basePrice: 3900,
  },
];

export const demoOrders: OrderRecord[] = [
  {
    id: "ord-demo-1",
    orderNumber: "WC-20260501-1001",
    totalAmount: 12900,
    pickupAddress: "上海市徐汇区漕溪北路 88 号 16 楼",
    notes: "工作日 19:00 后上门",
    status: "WASHING",
    createdAt: new Date("2026-05-01T09:30:00.000Z").toISOString(),
    user: {
      id: "usr-demo-1",
      fullName: "陈女士",
      phone: "13800000000",
      email: "chen@example.com",
    },
    items: [
      {
        id: "itm-demo-1",
        itemName: "羽绒服",
        quantity: 1,
        unitPrice: 12900,
        extraServices: "轻微油渍处理",
        serviceCategory: serviceCategorySeeds[1],
      },
    ],
  },
  {
    id: "ord-demo-2",
    orderNumber: "WC-20260501-1002",
    totalAmount: 17800,
    pickupAddress: "北京市朝阳区酒仙桥路 6 号院",
    notes: "前台寄存",
    status: "PICKED_UP",
    createdAt: new Date("2026-05-01T11:00:00.000Z").toISOString(),
    user: {
      id: "usr-demo-2",
      fullName: "林先生",
      phone: "13900000000",
      email: "lin@example.com",
    },
    items: [
      {
        id: "itm-demo-2",
        itemName: "运动鞋",
        quantity: 2,
        unitPrice: 8900,
        extraServices: "鞋边补白",
        serviceCategory: serviceCategorySeeds[0],
      },
    ],
  },
];
