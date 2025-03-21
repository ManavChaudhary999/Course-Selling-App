import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from '@/hooks/use-toast';

export default function InstructorSignup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [marketingOpt, setMarketingOpt] = useState(true);

  const { user, signup, loading } = useAuth();
  const {toast} = useToast();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup({name, email, password, role: 'INSTRUCTOR'});
      toast({
        title: 'Signed Up Successfully',
        variant: "success"
      })
      navigate('/instructor');
    } catch (err) {
      toast({
        title: 'Could Not Sign Up',
        description: (err as Error).message,
        variant: "destructive"
      })
    }
  };

  useEffect(() => {
    if (user) {
      navigate(-1);
    }
  }, [user]);

  return (
    <div className="min-h-screen flex">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-white p-12">
        <img
          src="/banner-img-2.webp"
          alt="Instructor illustration"
          className="max-w-md"
        />
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">
              Become a EduVista instructor
            </h1>
            <p className="text-gray-600">
              Discover a supportive community of online instructors. Get
              instant access to all course creation resources.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <Input
                id="name"
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3"
              />
            </div>
            <div>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3"
              />
            </div>
            <div>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3"
              />
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="marketing"
                checked={marketingOpt}
                onCheckedChange={(checked) => setMarketingOpt(checked as boolean)}
              />
              <label htmlFor="marketing" className="text-sm text-gray-600">
                I want to get the most out of my experience by receiving emails with insider tips, motivation, special updates and promotions reserved for instructors.
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
            >
              {loading ? "Loading..." : "Sign up"}
            </Button>

            <p className="text-center text-sm text-gray-600">
              By signing up, you agree to our{" "}
              <Link to="/terms" className="text-purple-600 hover:underline">
                Terms of Use
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-purple-600 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/instructor/login" className="text-purple-600 hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}