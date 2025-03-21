import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from '@/hooks/use-toast';


export default function InstructorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {user, login, loading } = useAuth();
  const {toast} = useToast();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({email, password, role: 'INSTRUCTOR'});
      toast({
        title: 'Logged In Successfully',
        variant: "success"
      })
      navigate('/instructor');
    } catch (err) {
      toast({
        title: 'Could Not Login',
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
              Log in to continue your teaching journey
            </h1>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
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

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
            >
              {loading ? "Loading..." : "Log In"}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Don't have an account? {" "}
              <Link to="/instructor/signup" className="text-purple-600 hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}