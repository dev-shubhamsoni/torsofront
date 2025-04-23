import { useGetDashboardStatsQuery } from "@/redux/dashboardApi";
import { Loader, CircleOff } from "lucide-react";

const colors = ["bg-[#fdf3ea]", "bg-[#f1fbf8]", "bg-[#f5f3fe]", "bg-[#f1f8fe]"];
const colorsBorder = ["border-[#fdf3ea]", "border-[#f1fbf8]", "border-[#f5f3fe]", "border-[#f1f8fe]"];

interface StatCardTypes {
  value : number;
  label : string;
  isLoading: boolean;
  bgColor: string;
  borderColor: string;
}

const StatCard : React.FC<StatCardTypes> = ({ value, label, isLoading, bgColor, borderColor }) => {
  return (
    <div className={`bg-white h-[80px] rounded-xl flex w-full p-3 border-t-4 border-solid cursor-pointer shadow-lg ${borderColor}`}>
      <div className="w-[40%] flex justify-center items-center">
        <div className={`${bgColor} p-3 rounded-full`}>
          <CircleOff width={20} height={20} className="text-black" />
        </div>
      </div>
      <div className="w-[60%] flex justify-center items-center flex-col">
        {isLoading ? (
          <Loader className="animate-spin" />
        ) : (
          <p className="text-[25px] font-medium">{value ?? 0}</p>
        )}
        <p className="font-bold text-center text-[14px] leading-[1.2em]">{label}</p>
      </div>
    </div>
  );
};

const DashboardStats = () => {
  const { data, isLoading } = useGetDashboardStatsQuery({});

  const stats = [
    { label: "Bid Count", value: data?.data[0]?.bid_count, bgColor: colors[0], borderColor: colorsBorder[0] },
    { label: "User Count", value: data?.data[0]?.user_count, bgColor: colors[1], borderColor: colorsBorder[1] },
    { label: "Market Count", value: data?.data[0]?.market_count, bgColor: colors[2], borderColor: colorsBorder[2] },
    { label: "Active User Count", value: data?.data[0]?.active_user_count, bgColor: colors[3], borderColor: colorsBorder[3] },
    { label: "Deactive User Count", value: data?.data[0]?.deactive_user_count, bgColor: colors[3], borderColor: colorsBorder[3] },
  ];

  return (
    <div className="grid grid-cols-5 w-full gap-4">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          value={stat.value}
          label={stat.label}
          isLoading={isLoading}
          bgColor={stat.bgColor}
          borderColor={stat.borderColor}
        />
      ))}
    </div>
  );
};

export default DashboardStats;
