interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
}

export const StatCard = ({ title, value, icon }: StatCardProps) => (
  <div className="bg-white rounded-lg shadow-lg p-6">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      {icon && <div className="text-gray-400">{icon}</div>}
    </div>
  </div>
);