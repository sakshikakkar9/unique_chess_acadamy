import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDemoAdmin } from "@/features/demo/hooks/useDemoAdmin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react"; // For WhatsApp

export default function RegistrationsPage() {
  const { demos, isLoading } = useDemoAdmin();

  const openWhatsApp = (phone: string, name: string) => {
    const msg = `Hello ${name}, this is Unique Chess Academy. We received your request for a free demo!`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="p-8 bg-background min-h-screen text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-heading">Student Management</h1>
        <p className="text-muted-foreground">Manage your demo leads and enrolled students.</p>
      </div>

      <Tabs defaultValue="demo" className="w-full">
        <TabsList className="bg-muted/20 border border-border mb-6">
          <TabsTrigger value="demo">Free Demo Requests</TabsTrigger>
          <TabsTrigger value="enrolled">Enrolled Students</TabsTrigger>
        </TabsList>

        <TabsContent value="demo">
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="p-4">Student</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Applied Date</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {demos.map((request: any) => (
                  <tr key={request.id} className="hover:bg-muted/10 transition-colors">
                    <td className="p-4 font-medium">{request.studentName}</td>
                    <td className="p-4">{request.phone}</td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="gap-2 border-green-500/50 text-green-500 hover:bg-green-500/10"
                        onClick={() => openWhatsApp(request.phone, request.studentName)}
                      >
                        <MessageCircle className="h-4 w-4" /> WhatsApp
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="enrolled">
          <div className="text-center py-20 border-2 border-dashed border-border rounded-xl">
            <p className="text-muted-foreground">Registered student data will appear here once payment integration is active.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}