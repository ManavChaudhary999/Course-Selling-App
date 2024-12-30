import { Link } from "react-router-dom";

const Homepage = () => {
  const courses = [
    { id: 1, title: "React for Beginners", description: "Learn React basics" },
    { id: 2, title: "Advanced React", description: "Master React concepts" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((course) => (
          <div key={course.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-bold">{course.title}</h2>
            <p>{course.description}</p>
            <Link to="/dashboard" className="text-blue-500 underline">
              Enroll
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Homepage;
