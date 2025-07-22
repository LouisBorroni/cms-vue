import jsPDF from "jspdf";

interface OrderItem {
  id: number;
  name: string;
  price: string | number;
  quantity: number;
  image_url?: string;
  description?: string;
}

interface Order {
  id: number;
  items: OrderItem[];
  total: string | number;
  created_at?: string;
}

interface User {
  email: string;
}

export function generateInvoicePDF(order: Order, user: User | null): void {
  const pdf = new jsPDF();

  // Logo "Foodland"
  pdf.setFontSize(20);
  pdf.setTextColor("#16a34a");
  pdf.text("Foodland", 14, 20);

  // Titre
  pdf.setFontSize(16);
  pdf.setTextColor("#000000");
  pdf.text("Votre facture", 14, 30);

  // Email utilisateur
  if (user?.email) {
    pdf.setFontSize(12);
    pdf.setTextColor("#444444");
    pdf.text(`Email client : ${user.email}`, 14, 40);
  }

  // Infos commande
  pdf.setFontSize(12);
  pdf.setTextColor("#444444");
  pdf.text(`Commande #${order.id}`, 14, user?.email ? 50 : 40);
  pdf.text(
    `Date : ${order.created_at ? new Date(order.created_at).toLocaleString() : "Date inconnue"}`,
    14,
    user?.email ? 58 : 48
  );

  let y = user?.email ? 70 : 60;
  order.items.forEach((item) => {
    const name = item.name ?? "Produit inconnu";
    const quantity = item.quantity ?? 0;
    const price = typeof item.price === "string" ? parseFloat(item.price) : item.price ?? 0;
    const lineTotal = price * quantity;

    pdf.text(`${name} (x${quantity})`, 14, y);
    pdf.text(`${lineTotal.toFixed(2)} €`, 150, y, { align: "right" });
    y += 10;
  });

  pdf.setFontSize(14);
  pdf.setTextColor("#16a34a");
  pdf.text("Total :", 14, y + 10);
  pdf.text(`${Number(order.total).toFixed(2)} €`, 150, y + 10, { align: "right" });

  pdf.save(`facture_commande_${order.id}.pdf`);
}
