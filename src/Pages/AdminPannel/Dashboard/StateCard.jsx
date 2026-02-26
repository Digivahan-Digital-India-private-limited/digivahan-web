const StatCard = ({ icon, title, value, change, subtitle, bgColor, iconColor }) => {
  const Icon = icon;

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6 flex items-start gap-4">
      <div className={`${bgColor} rounded-full p-3 sm:p-4`}>
        <Icon className={`${iconColor} w-6 h-6`} />
      </div>
      <div className="flex-1">
        <p className="text-gray-500 text-sm">{title}</p>
        <div className="flex items-center gap-2 mt-1">
          <h3 className="text-2xl sm:text-3xl font-bold">{value}</h3>
          <span
            className={`text-sm font-semibold ${
              change.startsWith("+") || change.startsWith("↑")
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {change}
          </span>
        </div>
        <p className="text-gray-400 text-xs mt-1">{subtitle}</p>
      </div>
    </div>
  );
};

export default StatCard;
