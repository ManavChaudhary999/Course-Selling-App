import { useAuth } from '@/contexts/AuthContext';
import { useCourses } from '@/contexts/CoursesContext';
import { useState } from 'react';

interface CourseFormData {
  title: string;
  description?: string;
  price: number;
  imageUrl?: string;
  // duration: string;
  creatorId: number;
}

interface CourseFormProps {
  onSubmit: (data: CourseFormData) => void;
  isLoading: boolean;
}

export const CourseForm = ({ onSubmit, isLoading }: CourseFormProps) => {
  const { user} = useAuth();
  const {} = useCourses();
  
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    // duration: '',
    price: 0,
    imageUrl: '',
    creatorId: user?.id || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      title: '',
      description: '',
      // duration: '',
      price: 0,
      imageUrl: '',
      creatorId: user?.id || 0,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 -ml-2 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 -ml-2 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Thumbnail Url
          </label>
          <input
            type="text"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            className="mt-1 -ml-2 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Price (In Rupees)
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            className="mt-1 -ml-2 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            step={5}
            min={0}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Instructor
          </label>
          <input
            type="text"
            defaultValue={user?.name}
            className="bg-gray-100 -ml-2 p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            readOnly
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          {isLoading ? 'Adding Course...' : 'Add Course'}
        </button>
      </div>
    </form>
  );
};