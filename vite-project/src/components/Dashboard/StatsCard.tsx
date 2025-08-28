interface StatsCardProps {
  title: string;
  value: string | number;
}

const StatsCard = ({ title, value }: StatsCardProps) => (
  <div className="bg-white rounded-2xl shadow-md p-6 text-center">
    <h3 className="text-gray-500 text-sm">{title}</h3>
    <p className="text-2xl font-bold mt-2">{value}</p>
  </div>
);

export default StatsCard;