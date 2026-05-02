"use client";

import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
  FieldError,
  FieldGroup,
  FieldHint,
  FieldLabel,
} from "@/components/ui/form";
import { Input, Textarea } from "@/components/ui/input";
import type { BookingFormValues, ServiceCategoryRecord } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

type BookingFormProps = {
  categories: ServiceCategoryRecord[];
};

const defaultCategoryId = (categories: ServiceCategoryRecord[]) =>
  categories[0]?.id ?? "";

export function BookingForm({ categories }: BookingFormProps) {
  const [step, setStep] = useState(1);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors },
  } = useForm<BookingFormValues>({
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      address: "",
      notes: "",
      quantity: 1,
      categoryId: defaultCategoryId(categories),
      itemName: "日常衣物洗护",
      extraServices: "",
    },
  });

  const values = useWatch({ control });
  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === values.categoryId),
    [categories, values.categoryId],
  );

  const total = (selectedCategory?.basePrice ?? 0) * Number(values.quantity || 1);

  async function goToAddressStep() {
    const valid = await trigger(["categoryId", "itemName", "quantity"]);
    if (valid) {
      setStep(2);
    }
  }

  async function goToConfirmStep() {
    const valid = await trigger(["fullName", "phone", "address"]);
    if (valid) {
      setStep(3);
    }
  }

  const onSubmit = handleSubmit(async (formValues) => {
    setIsSubmitting(true);
    setServerMessage(null);
    setCreatedOrder(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      const payload = (await response.json()) as
        | { orderNumber?: string; message?: string; error?: string }
        | undefined;

      if (!response.ok) {
        throw new Error(payload?.error ?? "提交失败");
      }

      setServerMessage(payload?.message ?? "预约已提交，我们会尽快联系你。");
      setCreatedOrder(payload?.orderNumber ?? null);
      setStep(1);
    } catch (error) {
      setServerMessage(
        error instanceof Error ? error.message : "提交失败，请稍后重试。",
      );
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <Card className="bg-slate-950">
        <div className="mb-8 flex items-center justify-between gap-3">
          <div>
            <CardTitle>三步完成预约</CardTitle>
            <CardDescription className="mt-2">
              选择品类、填写取件信息、确认订单后即可提交。
            </CardDescription>
          </div>
          <div className="flex gap-2 text-xs font-medium text-slate-400">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className={`flex h-9 w-9 items-center justify-center rounded-full border ${
                  step === item
                    ? "border-cyan-400 bg-cyan-400/15 text-cyan-200"
                    : "border-white/10"
                }`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <form className="space-y-6" onSubmit={onSubmit}>
          {step === 1 ? (
            <>
              <FieldGroup>
                <FieldLabel htmlFor="categoryId">服务类目</FieldLabel>
                <select
                  id="categoryId"
                  className="min-h-12 w-full rounded-2xl border border-white/12 bg-slate-900 px-4 text-sm text-slate-50 outline-none focus:border-cyan-400"
                  {...register("categoryId", {
                    required: "请选择服务类目",
                  })}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name} · {formatCurrency(category.basePrice)}
                    </option>
                  ))}
                </select>
                {errors.categoryId ? (
                  <FieldError>{errors.categoryId.message}</FieldError>
                ) : null}
              </FieldGroup>

              <div className="grid gap-4 md:grid-cols-2">
                <FieldGroup>
                  <FieldLabel htmlFor="itemName">物品名称</FieldLabel>
                  <Input
                    id="itemName"
                    placeholder="例如：羽绒服、运动鞋、托特包"
                    {...register("itemName", {
                      required: "请填写物品名称",
                    })}
                  />
                  {errors.itemName ? (
                    <FieldError>{errors.itemName.message}</FieldError>
                  ) : null}
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel htmlFor="quantity">数量</FieldLabel>
                  <Input
                    id="quantity"
                    min={1}
                    type="number"
                    {...register("quantity", {
                      required: "请填写数量",
                      min: {
                        value: 1,
                        message: "数量至少为 1",
                      },
                      valueAsNumber: true,
                    })}
                  />
                  {errors.quantity ? (
                    <FieldError>{errors.quantity.message}</FieldError>
                  ) : null}
                </FieldGroup>
              </div>

              <FieldGroup>
                <FieldLabel htmlFor="extraServices">附加服务</FieldLabel>
                <Input
                  id="extraServices"
                  placeholder="例如：去渍、补色、鞋底深洗"
                  {...register("extraServices")}
                />
              </FieldGroup>

              <Button className="w-full" onClick={goToAddressStep}>
                下一步：填写地址
              </Button>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <FieldGroup>
                  <FieldLabel htmlFor="fullName">联系人</FieldLabel>
                  <Input
                    id="fullName"
                    placeholder="张女士"
                    {...register("fullName", {
                      required: "请填写联系人姓名",
                    })}
                  />
                  {errors.fullName ? (
                    <FieldError>{errors.fullName.message}</FieldError>
                  ) : null}
                </FieldGroup>

                <FieldGroup>
                  <FieldLabel htmlFor="phone">手机号</FieldLabel>
                  <Input
                    id="phone"
                    placeholder="13800000000"
                    {...register("phone", {
                      required: "请填写手机号",
                      minLength: {
                        value: 6,
                        message: "手机号格式不正确",
                      },
                    })}
                  />
                  {errors.phone ? (
                    <FieldError>{errors.phone.message}</FieldError>
                  ) : null}
                </FieldGroup>
              </div>

              <FieldGroup>
                <FieldLabel htmlFor="email">邮箱</FieldLabel>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  {...register("email")}
                />
                <FieldHint>选填，用于发送电子小票与状态通知。</FieldHint>
              </FieldGroup>

              <FieldGroup>
                <FieldLabel htmlFor="address">取件地址</FieldLabel>
                <Textarea
                  id="address"
                  placeholder="填写详细楼栋、门牌和取件备注"
                  {...register("address", {
                    required: "请填写取件地址",
                    minLength: {
                      value: 8,
                      message: "请填写更完整的地址",
                    },
                  })}
                />
                {errors.address ? (
                  <FieldError>{errors.address.message}</FieldError>
                ) : null}
              </FieldGroup>

              <FieldGroup>
                <FieldLabel htmlFor="notes">订单备注</FieldLabel>
                <Textarea
                  id="notes"
                  placeholder="例如：门口自提、晚上 8 点后上门"
                  {...register("notes")}
                />
              </FieldGroup>

              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  onClick={() => setStep(1)}
                  variant="secondary"
                >
                  返回上一步
                </Button>
                <Button className="flex-1" onClick={goToConfirmStep}>
                  下一步：确认订单
                </Button>
              </div>
            </>
          ) : null}

          {step === 3 ? (
            <>
              <Card className="border-cyan-400/20 bg-slate-900/80 p-5">
                <div className="grid gap-4 text-sm text-slate-300">
                  <div className="flex items-center justify-between gap-3">
                    <span>服务类目</span>
                    <span className="font-medium text-slate-100">
                      {selectedCategory?.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>物品与数量</span>
                    <span className="font-medium text-slate-100">
                      {values.itemName} × {values.quantity}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>取件地址</span>
                    <span className="max-w-xs text-right font-medium text-slate-100">
                      {values.address}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>预估金额</span>
                    <span className="text-lg font-semibold text-cyan-200">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </Card>

              <div className="flex gap-3">
                <Button
                  className="flex-1"
                  onClick={() => setStep(2)}
                  variant="secondary"
                >
                  返回修改
                </Button>
                <Button className="flex-1" disabled={isSubmitting} type="submit">
                  {isSubmitting ? "提交中..." : "确认并提交"}
                </Button>
              </div>
            </>
          ) : null}
        </form>
      </Card>

      <Card className="bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/70">
        <CardTitle>预约须知</CardTitle>
        <CardDescription className="mt-2">
          目前为 MVP 演示版，未配置数据库时会自动使用本地示例数据，方便先完成前后端联调与页面验证。
        </CardDescription>

        <div className="mt-6 space-y-4 text-sm text-slate-300">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="font-medium text-slate-50">预计上门</p>
            <p className="mt-2 leading-6">城区默认 2 小时内响应，支持晚间取件与预约时间备注。</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="font-medium text-slate-50">服务状态</p>
            <p className="mt-2 leading-6">订单会经历 `PENDING`、`PICKED_UP`、`WASHING`、`DELIVERING`、`COMPLETED`。</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="font-medium text-slate-50">费用说明</p>
            <p className="mt-2 leading-6">页面金额为基础价估算，特殊材质、复杂修复会在取件后复核。</p>
          </div>
        </div>

        {serverMessage ? (
          <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-100">
            <p>{serverMessage}</p>
            {createdOrder ? <p className="mt-2">订单号：{createdOrder}</p> : null}
          </div>
        ) : null}
      </Card>
    </div>
  );
}
