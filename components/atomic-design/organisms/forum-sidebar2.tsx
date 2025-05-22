import { cn } from "@/lib/utils";

const categories = [
  { name: "GENERAL", color: "text-blue-600" },
  { name: "NEWS", color: "text-pink-600" },
  { name: "TEST", color: "text-green-600" },
  { name: "ALGORITHMS", color: "text-yellow-600" },
  { name: "ORGANISATION", color: "text-purple-600" },
  { name: "PROJECT", color: "text-gray-600" },
];

export function ForumSidebar() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-bold text-lg mb-2">All discussions</h2>
        <ul className="space-y-2">
          <li className="cursor-pointer text-blue-500 font-medium">All discussions</li>
          <li className="cursor-pointer text-gray-600 hover:text-blue-500">Following</li>
        </ul>
      </div>

      <div>
        <h3 className="font-bold text-md mb-2">Categories</h3>
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li
              key={cat.name}
              className={cn("cursor-pointer flex items-center gap-2 hover:text-blue-500")}
            >
              <span className={`h-2 w-2 rounded-full ${cat.color}`}></span>
              {cat.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
