import { Skeleton } from "./ui/skeleton";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

export default function LoadingSkeleton() {
    return (
        <div className="h-screen flex flex-col justify-center items-center space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
    );
}

export function LoginSkeleton() {
    return (
        <div className="flex h-screen flex-col items-center justify-center">
            <Card className="w-[400px]">
                <CardHeader className="text-center">
                    <div className="h-7 w-48 bg-gray-200 rounded-md animate-pulse mx-auto mb-2" />
                    <div className="h-5 w-64 bg-gray-200 rounded-md animate-pulse mx-auto" />
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <div className="h-5 w-16 bg-gray-200 rounded-md animate-pulse" />
                            <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse" />
                        </div>
                        <div className="grid gap-2">
                            <div className="h-5 w-16 bg-gray-200 rounded-md animate-pulse" />
                            <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse" />
                        </div>
                        <div className="grid gap-2">
                            <div className="h-5 w-16 bg-gray-200 rounded-md animate-pulse" />
                            <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse" />
                        </div>
                        <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse" />
                    </div>
                    <div className="mt-4 flex justify-center gap-2">
                        <div className="h-5 w-36 bg-gray-200 rounded-md animate-pulse" />
                        <div className="h-5 w-12 bg-gray-200 rounded-md animate-pulse" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export function InstructorDashboardSkeleton() {
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {[1, 2].map((index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-4 rounded-full" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-24" />
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table className="w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        <Skeleton className="h-4 w-24" />
                                    </TableHead>
                                    <TableHead>
                                        <Skeleton className="h-4 w-24" />
                                    </TableHead>
                                    <TableHead>
                                        <Skeleton className="h-4 w-32" />
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[1, 2, 3].map((index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Skeleton className="h-4 w-48" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-4 w-32" />
                                        </TableCell>
                                        <TableCell>
                                            <Skeleton className="h-4 w-40" />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export function CourseCardSkeleton() {
    return (
        <Card className="h-full">
            <CardContent className="flex flex-col p-4 h-full">
                <Skeleton className="w-full aspect-video mb-4" />
                <div className="flex-1 flex flex-col gap-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3 mt-2" />
                    <Skeleton className="h-6 w-1/4 mt-auto" />
                </div>
            </CardContent>
        </Card>
    );
}

export function CoursesPurchasedSkeleton() {
    return (
        <div className="p-4">
            <h1 className="text-3xl font-bold mb-8">My Courses</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {[1, 2, 3].map((item) => (
                    <CourseCardSkeleton key={item} />
                ))}
            </div>
        </div>
    );
}

export function CourseDetailsSkeleton() {
    return (
        <div className="mx-auto p-4">
            <div className="bg-gray-900 text-white p-8 rounded-t-lg">
                <div className="h-8 w-3/4 bg-gray-700 rounded-md animate-pulse mb-4" />
                <div className="flex items-center space-x-4 mt-2">
                    <div className="h-4 w-32 bg-gray-700 rounded-md animate-pulse" />
                    <div className="h-4 w-32 bg-gray-700 rounded-md animate-pulse" />
                    <div className="h-4 w-32 bg-gray-700 rounded-md animate-pulse" />
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-8 mt-8">
                <main className="flex-grow">
                    <Card className="mb-8">
                        <CardHeader>
                            <div className="h-6 w-40 bg-gray-200 rounded-md animate-pulse" />
                        </CardHeader>
                        <CardContent>
                            <div className="h-20 bg-gray-200 rounded-md animate-pulse" />
                        </CardContent>
                    </Card>
                    <Card className="mb-8">
                        <CardHeader>
                            <div className="h-6 w-40 bg-gray-200 rounded-md animate-pulse" />
                        </CardHeader>
                        <CardContent>
                            {[1, 2, 3, 4].map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center mb-4"
                                >
                                    <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse mr-2" />
                                    <div className="h-4 w-48 bg-gray-200 rounded-md animate-pulse" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </main>
                <aside className="w-full md:w-[500px]">
                    <Card className="sticky top-4">
                        <CardContent className="p-6">
                            <div className="aspect-video mb-4 bg-gray-200 rounded-lg animate-pulse" />
                            <div className="h-8 w-32 bg-gray-200 rounded-md animate-pulse mb-4" />
                            <div className="h-10 w-full bg-gray-200 rounded-md animate-pulse" />
                        </CardContent>
                    </Card>
                </aside>
            </div>
        </div>
    );
}

export function CourseProgressSkeleton() {
    return (
        <div className="relative flex flex-col h-full w-full bg-background text-foreground">
            <header className="flex items-center justify-between p-4 bg-card border-b mr-[400px] transition-all duration-300">
                <div className="h-9 w-48 bg-gray-200 rounded-md animate-pulse" />
                <div className="h-6 w-64 bg-gray-200 rounded-md animate-pulse hidden md:block" />
                <div className="h-9 w-9 bg-gray-200 rounded-md animate-pulse" />
            </header>

            <main className="flex flex-1 overflow-hidden">
                <div className="flex-1 flex flex-col mr-[400px] transition-all duration-300">
                    <div className="relative aspect-video bg-gray-200 animate-pulse" />
                    <div className="p-6 bg-card flex-1">
                        <div className="h-8 w-3/4 bg-gray-200 rounded-md animate-pulse mb-4" />
                        <div className="h-20 bg-gray-200 rounded-md animate-pulse" />
                    </div>
                </div>

                <aside className="fixed right-0 top-[64px] bottom-0 w-[400px] bg-card border-l border-t shadow-lg">
                    <Tabs defaultValue="content" className="h-full flex flex-col">
                        <TabsList className="w-full grid grid-cols-2 p-2 h-14 bg-background">
                            <TabsTrigger value="content">Course Content</TabsTrigger>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                        </TabsList>

                        <TabsContent value="content" className="flex-1 m-0">
                            <ScrollArea className="h-[calc(100vh-15rem)]">
                                <div className="p-4 space-y-2">
                                    {[1, 2, 3, 4, 5].map((item) => (
                                        <div
                                            key={item}
                                            className="w-full flex items-center p-3 rounded-lg"
                                        >
                                            <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse" />
                                            <div className="h-4 w-48 bg-gray-200 rounded-md animate-pulse ml-3" />
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </TabsContent>

                        <TabsContent value="overview" className="flex-1 m-0">
                            <ScrollArea className="h-[calc(100vh-15rem)]">
                                <div className="p-6">
                                    <div className="h-6 w-40 bg-gray-200 rounded-md animate-pulse mb-4" />
                                    <div className="h-32 bg-gray-200 rounded-md animate-pulse" />
                                </div>
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                </aside>
            </main>
        </div>
    );
}