import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { clearBuyCompareIds, getBuyCompareIds, setBuyCompareIds } from "../services/buyerCompareStorage";
import {
  compareMarketplaceListings,
  reserveMarketplaceListing,
} from "../services/marketplaceBuyerApi";

const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const BuyCarComparePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fromQuery = (searchParams.get("ids") || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const [ids, setIds] = useState(fromQuery.length ? fromQuery : getBuyCompareIds());

  const { data: compared = [], isLoading } = useQuery({
    queryKey: ["marketplace-compare", ids.join(",")],
    queryFn: () => compareMarketplaceListings(ids),
    enabled: ids.length >= 2,
  });

  const reserveMutation = useMutation({
    mutationFn: reserveMarketplaceListing,
    onSuccess: (order) => {
      queryClient.setQueryData(["user-orders"], (prev = []) => {
        const current = Array.isArray(prev) ? prev : [];
        return [
          order,
          ...current.filter((item) => String(item.id) !== String(order.id)),
        ];
      });
      toast.success("Car reserved successfully");
      navigate(`/orders/${order.id}/review`);
    },
  });

  const removeItem = (id) => {
    const next = setBuyCompareIds(ids.filter((item) => item !== id));
    setIds(next);
  };

  const clearAll = () => {
    clearBuyCompareIds();
    setIds([]);
  };

  const reserveCar = async (car) => {
    try {
      await reserveMutation.mutateAsync(car);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to reserve this car");
    }
  };

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
        Loading compared cars...
      </section>
    );
  }

  if (compared.length < 2) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
        Select at least 2 cars to compare.
        <Link
          to="/marketplace/buy"
          className="ml-3 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Back to Buy Cars
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Compare Cars</h2>
            <p className="text-sm text-slate-500">Compare shortlisted cars side-by-side before reserving.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={clearAll}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Clear Compare
            </button>
            <Link
              to="/marketplace/buy"
              className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              Add More Cars
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {compared.map((car) => (
          <article key={car.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <img
              src={car.image}
              alt={car.title}
              className="h-40 w-full rounded-xl border border-slate-200 bg-slate-50 object-contain"
            />
            <h3 className="mt-3 text-base font-semibold text-slate-900">{car.title}</h3>
            <p className="mt-1 text-lg font-bold text-slate-900">{formatPrice(car.price)}</p>
            <ul className="mt-3 space-y-1 text-sm text-slate-600">
              <li>City: {car.city}</li>
              <li>Fuel: {car.fuel}</li>
              <li>Transmission: {car.transmission}</li>
              <li>KMs: {car.kms.toLocaleString()}</li>
              <li>Ownership: {car.ownership || "First Owner"}</li>
              <li>Inspection Score: {car.inspectionScore || "8.4/10"}</li>
            </ul>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to={`/marketplace/buy/${car.id}`}
                className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                View Details
              </Link>
              <button
                type="button"
                onClick={() => reserveCar(car)}
                disabled={reserveMutation.isPending}
                className="rounded-xl border border-emerald-200 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {reserveMutation.isPending ? "Reserving..." : "Reserve Now"}
              </button>
              <button
                type="button"
                onClick={() => removeItem(car.id)}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Remove
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default BuyCarComparePage;
