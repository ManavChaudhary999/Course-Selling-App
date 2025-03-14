import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from '@/hooks/use-toast';

enum RoleType {
  INSTRUCTOR = 'INSTRUCTOR',
  STUDENT = 'STUDENT'
}

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<RoleType>(RoleType.STUDENT);

  const { user, signup, loading } = useAuth();
  const {toast} = useToast();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup({name, email, password, role});
      toast({
        title: 'Logged In Successfully',
        variant: "success"
      })
      navigate(role === 'INSTRUCTOR' ? '/instructor' : "/");
    } catch (err) {
      toast({
        title: 'Could Not Login',
        description: (err as Error).message,
        variant: "destructive"
      })
    }
  };

  const handleTabChange = (value: string) => {
    setRole(value === "STUDENT" ? RoleType.STUDENT : RoleType.INSTRUCTOR);
    setName("");
    setEmail("");
    setPassword("");
  };

  useEffect(() => {
    if (user) {
      navigate(-1);
    }
  }, [user]);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader className="text-center">
          <CardTitle>Welcome, Register here</CardTitle>
          <CardDescription>
            Choose your account type to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={role} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value={RoleType.STUDENT}>Student</TabsTrigger>
              <TabsTrigger value={RoleType.INSTRUCTOR}>Instructor</TabsTrigger>
            </TabsList>
            <TabsContent value={RoleType.STUDENT}>
              <form onSubmit={onSubmit}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value )}
                      placeholder="Don John"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value )}
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value )}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Loading..." : "Sign Up"}
                  </Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value={RoleType.INSTRUCTOR}>
              <form onSubmit={onSubmit}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="admin-name">Name</Label>
                    <Input
                      id="admin-name"
                      type="text"
                      value={name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value )}
                      placeholder="Don John"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="admin-email">Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value )}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      value={password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value )}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Loading..." : "Sign Up"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}