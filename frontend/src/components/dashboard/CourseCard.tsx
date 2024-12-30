import { Course } from '@/types';

interface CourseCardProps {
  course: Course;
  onAction?: () => void;
  actionLabel?: string;
}

export const CourseCard = ({ course, onAction, actionLabel = 'View course' }: CourseCardProps) => (
  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg mb-4">
    <div>
      <h3 className="font-semibold">{course.title}</h3>
      <p className="text-sm text-gray-600">by {course.instructor}</p>
    </div>
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-600">{course.duration} min</span>
      {onAction && (
        <button
          onClick={onAction}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {actionLabel}
        </button>
      )}
    </div>
  </div>
);