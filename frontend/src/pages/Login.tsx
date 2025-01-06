import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ErrorMessage } from '../components/ErrorMessage';

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

enum RoleType {
  USER = 'user',
  ADMIN = 'admin'
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<RoleType>(RoleType.USER);
  const [error, setError] = useState<string>("");
  const {user, isAdmin, login, loading } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password, role);
      navigate(role === 'admin' ? '/admin' : "/");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleTabChange = (value: string) => {
    setRole(value === "user" ? RoleType.USER : RoleType.ADMIN);
    setEmail("");
    setPassword("");
  };

  useEffect(() => {
    if (user) {
      navigate(isAdmin ? '/admin' : "/");
    }
  }, [user]);

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader className="text-center">
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>
            Choose your account type to continue
          </CardDescription>
        <ErrorMessage message={error} />
        </CardHeader>
        <CardContent>
          <Tabs value={role} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value={RoleType.USER}>User</TabsTrigger>
              <TabsTrigger value={RoleType.ADMIN}>Admin</TabsTrigger>
            </TabsList>
            <TabsContent value="user">
              <form onSubmit={onSubmit}>
                <div className="grid gap-4">
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
                    {loading ? "Loading..." : "Sign In"}
                  </Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="admin">
              <form onSubmit={onSubmit}>
                <div className="grid gap-4">
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
                    {loading ? "Loading..." : "Sign In"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}