import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, ShoppingCart, MapPin, Clock, Star, Truck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Medication {
  name: string;
  dosage: string;
  quantity: number;
  price: number;
}

interface PharmacyOrder {
  id: string;
  medications: Medication[];
  pharmacy_partner: string;
  total_amount: number;
  delivery_status: string;
  order_date: string;
  delivery_date?: string;
  tracking_number?: string;
}

interface PharmacyPartner {
  name: string;
  rating: number;
  delivery_time: string;
  delivery_fee: number;
  location: string;
}

export const PharmacyIntegration = () => {
  const [orders, setOrders] = useState<PharmacyOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMedications, setSelectedMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const pharmacyPartners: PharmacyPartner[] = [
    {
      name: "MedPlus Pharmacy",
      rating: 4.5,
      delivery_time: "30-45 mins",
      delivery_fee: 25,
      location: "Bandra West, Mumbai"
    },
    {
      name: "Apollo Pharmacy",
      rating: 4.7,
      delivery_time: "25-40 mins",
      delivery_fee: 30,
      location: "Andheri East, Mumbai"
    },
    {
      name: "Netmeds Local",
      rating: 4.3,
      delivery_time: "45-60 mins",
      delivery_fee: 0,
      location: "Powai, Mumbai"
    }
  ];

  const commonMedications = [
    { name: "Paracetamol", dosage: "500mg", quantity: 10, price: 25 },
    { name: "Amoxicillin", dosage: "250mg", quantity: 10, price: 120 },
    { name: "Omeprazole", dosage: "20mg", quantity: 15, price: 85 },
    { name: "Metformin", dosage: "500mg", quantity: 30, price: 45 },
    { name: "Atorvastatin", dosage: "10mg", quantity: 30, price: 180 }
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('pharmacy_orders')
        .select('*')
        .eq('patient_id', 'current_user_id') // Replace with actual auth.uid()
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders((data as any) || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load pharmacy orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (medication: Medication) => {
    const existing = selectedMedications.find(m => m.name === medication.name);
    if (existing) {
      setSelectedMedications(prev => 
        prev.map(m => m.name === medication.name 
          ? { ...m, quantity: m.quantity + 1 }
          : m
        )
      );
    } else {
      setSelectedMedications(prev => [...prev, { ...medication, quantity: 1 }]);
    }
    toast({
      title: "Added to Cart",
      description: `${medication.name} added to cart`,
    });
  };

  const removeFromCart = (medicationName: string) => {
    setSelectedMedications(prev => prev.filter(m => m.name !== medicationName));
  };

  const placeOrder = async (pharmacyPartner: PharmacyPartner) => {
    if (selectedMedications.length === 0) {
      toast({
        title: "Error",
        description: "Please add medications to cart first",
        variant: "destructive",
      });
      return;
    }

    const totalAmount = selectedMedications.reduce((sum, med) => sum + (med.price * med.quantity), 0) + pharmacyPartner.delivery_fee;

    try {
      const { error } = await supabase
        .from('pharmacy_orders')
        .insert({
          patient_id: 'current_user_id', // Replace with actual auth.uid()
          medications: selectedMedications as any,
          pharmacy_partner: pharmacyPartner.name,
          total_amount: totalAmount,
          delivery_address: {
            street: "Sample Address",
            city: "Mumbai",
            state: "Maharashtra",
            pincode: "400001"
          } as any
        });

      if (error) throw error;

      toast({
        title: "Order Placed",
        description: `Order placed with ${pharmacyPartner.name}`,
      });

      setSelectedMedications([]);
      fetchOrders();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to place order",
        variant: "destructive",
      });
    }
  };

  const filteredMedications = commonMedications.filter(med =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cartTotal = selectedMedications.reduce((sum, med) => sum + (med.price * med.quantity), 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pharmacy</h1>
        <p className="text-muted-foreground">Order medicines online with delivery tracking</p>
      </div>

      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList>
          <TabsTrigger value="browse">Browse Medicines</TabsTrigger>
          <TabsTrigger value="cart">Cart ({selectedMedications.length})</TabsTrigger>
          <TabsTrigger value="orders">My Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search medicines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMedications.map((medication, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{medication.name}</CardTitle>
                  <CardDescription>{medication.dosage}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-2xl font-bold">₹{medication.price}</p>
                      <p className="text-sm text-muted-foreground">per strip</p>
                    </div>
                    <Button onClick={() => addToCart(medication)} size="sm">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cart" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Shopping Cart</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedMedications.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Your cart is empty</p>
                  ) : (
                    <div className="space-y-4">
                      {selectedMedications.map((med, index) => (
                        <div key={index} className="flex justify-between items-center p-3 border rounded">
                          <div>
                            <h4 className="font-medium">{med.name}</h4>
                            <p className="text-sm text-muted-foreground">{med.dosage}</p>
                            <p className="text-sm">Quantity: {med.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">₹{med.price * med.quantity}</p>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeFromCart(med.name)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{cartTotal}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>₹{cartTotal}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <h3 className="font-semibold">Select Pharmacy</h3>
                {pharmacyPartners.map((partner, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">{partner.name}</h4>
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {partner.rating}
                          </div>
                        </div>
                        <Badge variant="outline">₹{partner.delivery_fee}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {partner.delivery_time}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {partner.location}
                        </div>
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={() => placeOrder(partner)}
                        disabled={selectedMedications.length === 0}
                      >
                        Order from {partner.name}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center h-32">Loading orders...</div>
          ) : orders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No orders found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                        <CardDescription>
                          {order.pharmacy_partner} • {new Date(order.order_date).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Badge 
                        variant={
                          order.delivery_status === 'delivered' ? 'default' :
                          order.delivery_status === 'shipped' ? 'secondary' : 'outline'
                        }
                      >
                        {order.delivery_status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium mb-2">Medications</h4>
                        <div className="space-y-1">
                          {order.medications.map((med, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{med.name} ({med.dosage}) x{med.quantity}</span>
                              <span>₹{med.price * med.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-3 border-t">
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4" />
                          <span className="text-sm">
                            {order.tracking_number ? `Tracking: ${order.tracking_number}` : 'Preparing order'}
                          </span>
                        </div>
                        <span className="font-bold">₹{order.total_amount}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};