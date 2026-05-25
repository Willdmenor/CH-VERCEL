// Painel administrativo — CRUD de produtos premium
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  RefreshCw, 
  Search, 
  LayoutGrid, 
  Package, 
  Image as ImageIcon,
  Layers,
  CheckCircle2
} from "lucide-react";

export const Route = createFileRoute("/admin/produtos")({
  head: () => ({
    meta: [
      { title: "Dashboard Admin — Gestão de Catálogo | CH.Style" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminProdutosPage,
});

// ----- tipos -----
type ProductImage = { id?: string; url: string; alt?: string | null; position: number };
type ProductVariant = { id?: string; color: string; size: string; stock: number; sku?: string | null };
type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceCents: number;
  category: string;
  active: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
  createdAt?: string;
  updatedAt?: string;
};

type FormState = {
  slug: string;
  name: string;
  description: string;
  priceReais: string; // input em reais; convertido p/ centavos no submit
  category: string;
  active: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
};

const emptyForm: FormState = {
  slug: "",
  name: "",
  description: "",
  priceReais: "",
  category: "",
  active: true,
  images: [],
  variants: [],
};

function fromProduct(p: Product): FormState {
  return {
    slug: p.slug,
    name: p.name,
    description: p.description,
    priceReais: (p.priceCents / 100).toFixed(2),
    category: p.category,
    active: p.active,
    images: p.images.map((i, idx) => ({ url: i.url, alt: i.alt ?? "", position: i.position ?? idx })),
    variants: p.variants.map((v) => ({ color: v.color, size: v.size, stock: v.stock, sku: v.sku ?? "" })),
  };
}

function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function AdminProdutosPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: "20" });
      if (search.trim()) params.set("search", search.trim());
      
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json().catch(() => ({ error: "Resposta da rede inválida" }));
      
      if (!res.ok) {
        throw new Error(data.error || `Erro do servidor (${res.status})`);
      }
      
      setItems(data.items ?? []);
      setTotalPages(data.totalPages ?? 1);
    } catch (err: any) {
      console.error("[Admin Load Error]:", err);
      toast.error("Não foi possível carregar produtos", {
        description: err.message || "Verifique sua conexão ou tente novamente."
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    setForm(fromProduct(p));
    setDialogOpen(true);
  }

  async function submit() {
    const priceCents = Math.round(parseFloat(form.priceReais.replace(",", ".").trim()) * 100);
    if (!form.slug || !form.name || !form.description || !form.category || Number.isNaN(priceCents)) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    const payload = {
      slug: form.slug,
      name: form.name,
      description: form.description,
      priceCents,
      category: form.category,
      active: form.active,
      images: form.images
        .filter((i) => i.url.trim())
        .map((i, idx) => ({ url: i.url, alt: i.alt || undefined, position: i.position ?? idx })),
      variants: form.variants
        .filter((v) => v.color.trim() && v.size.trim())
        .map((v) => ({
          color: v.color,
          size: v.size,
          stock: Number(v.stock) || 0,
          sku: v.sku?.trim() ? v.sku : null,
        })),
    };

    setSaving(true);
    try {
      const url = editing ? `/api/products/${editing.id}` : `/api/products`;
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data?.error || data?.message || "Falha ao salvar produto", {
          description: data?.details ? JSON.stringify(data.details) : undefined
        });
        return;
      }
      toast.success(editing ? "Produto atualizado" : "Produto criado");
      setDialogOpen(false);
      load();
    } catch (err) {
      console.error(err);
      toast.error("Erro de rede");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Falha");
      toast.success("Produto removido");
      setDeleteTarget(null);
      load();
    } catch (err) {
      console.error(err);
      toast.error("Falha ao remover");
    } finally {
      setDeleting(false);
    }
  }

  const filtered = items;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-foreground pb-20">
      {/* Header Profissional */}
      <div className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-30">
        <div className="container-ch py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-gold/10 p-3 rounded-xl border border-gold/20">
                <LayoutGrid className="h-6 w-6 text-gold" />
              </div>
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Painel de Controle</h1>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 uppercase tracking-widest">
                  <span className="text-gold">Admin</span>
                  <span>•</span>
                  <span>Gestão de Catálogo</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={load} 
                disabled={loading}
                className="bg-card hover:bg-gold/5 border-border transition-all"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Atualizar
              </Button>
              <Button 
                onClick={openCreate}
                className="bg-gradient-gold text-primary-foreground border-none hover:shadow-gold transition-all"
              >
                <Plus className="h-4 w-4 mr-2" /> Novo Produto
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-ch mt-8 space-y-8 animate-fade-up">
        {/* Stats / Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card/30 border-border/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Total de Produtos</p>
                  <p className="text-3xl font-bold">{items.length}</p>
                </div>
                <div className="bg-gold/10 p-2 rounded-lg">
                  <Package className="h-5 w-5 text-gold" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/30 border-border/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Produtos Ativos</p>
                  <p className="text-3xl font-bold">{items.filter(i => i.active).length}</p>
                </div>
                <div className="bg-green-500/10 p-2 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/30 border-border/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Categorias</p>
                  <p className="text-3xl font-bold">{new Set(items.map(i => i.category)).size}</p>
                </div>
                <div className="bg-blue-500/10 p-2 rounded-lg">
                  <LayoutGrid className="h-5 w-5 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Busca */}
        <Card className="bg-card/30 border-border/50">
          <CardContent className="py-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setPage(1);
                load();
              }}
              className="flex flex-col md:flex-row gap-4"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar por nome, SKU ou categoria..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-background/50 border-border/50 focus:border-gold/50"
                />
              </div>
              <Button type="submit" variant="secondary" className="px-8">
                Filtrar Resultados
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Tabela de Produtos */}
        <Card className="bg-card/30 border-border/50 overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="w-[80px]">Img</TableHead>
                <TableHead>Identificação</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Preço</TableHead>
                <TableHead className="text-center">Variantes</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-border/50">
                    <TableCell colSpan={7}><Skeleton className="h-12 w-full bg-muted/20" /></TableCell>
                  </TableRow>
                ))
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-sm text-muted-foreground py-20">
                    Nenhum produto cadastrado até o momento.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((p) => (
                  <TableRow key={p.id} className="border-border/50 hover:bg-muted/10 transition-colors">
                    <TableCell>
                      <div className="h-12 w-10 bg-charcoal rounded overflow-hidden border border-border/50">
                        {p.images?.[0]?.url ? (
                          <img src={p.images[0].url} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground leading-tight">{p.name}</span>
                        <span className="text-[10px] text-muted-foreground font-mono mt-1">{p.slug}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal border-gold/20 text-gold/80 bg-gold/5 lowercase">
                        {p.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium">
                      {formatBRL(p.priceCents)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-wrap gap-1 justify-center max-w-[120px] mx-auto">
                         <span className="text-xs bg-muted px-1.5 py-0.5 rounded border border-border/50">
                           {p.variants?.length ?? 0} opções
                         </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {p.active ? (
                        <div className="flex items-center justify-center gap-1.5 text-green-500 text-[11px] font-medium uppercase tracking-wider">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                          Ativo
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1.5 text-muted-foreground text-[11px] font-medium uppercase tracking-wider">
                          <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                          Inativo
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => openEdit(p)} 
                          className="h-8 w-8 hover:bg-gold/10 hover:text-gold transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => setDeleteTarget(p)}
                          className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Modal Profissional */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[95vh] p-0 overflow-hidden bg-card border-border shadow-2xl">
          <div className="bg-muted/30 p-6 border-b border-border">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-gold/10 p-2 rounded-lg">
                  <Package className="h-5 w-5 text-gold" />
                </div>
                <DialogTitle className="text-2xl font-bold">
                  {editing ? "Configurações do Produto" : "Novo Cadastro de Produto"}
                </DialogTitle>
              </div>
              <DialogDescription>
                Gerencie as informações detalhadas, estoque e variantes do seu catálogo premium.
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(95vh-180px)]">
            <div className="space-y-8">
              {/* Seção: Informações Básicas */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold font-semibold">
                  <LayoutGrid className="h-3 w-3" />
                  Informações Gerais
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-widest text-muted-foreground">Nome da Peça *</Label>
                    <Input 
                      placeholder="Ex: Camiseta Oversized Noir"
                      value={form.name} 
                      onChange={(e) => setForm({ ...form, name: e.target.value })} 
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-widest text-muted-foreground">Slug (URL Amigável) *</Label>
                    <Input
                      placeholder="camiseta-oversized-noir"
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/ /g, "-") })}
                      className="bg-background/50 font-mono text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-widest text-muted-foreground">Categoria *</Label>
                    <Input 
                      placeholder="Ex: Camisetas"
                      value={form.category} 
                      onChange={(e) => setForm({ ...form, category: e.target.value })} 
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-widest text-muted-foreground">Preço de Venda (R$) *</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                      <Input
                        inputMode="decimal"
                        pattern="[0-9]*[.,]?[0-9]*"
                        value={form.priceReais}
                        onChange={(e) => setForm({ ...form, priceReais: e.target.value })}
                        placeholder="0,00"
                        className="pl-9 bg-background/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-xs uppercase tracking-widest text-muted-foreground">Descrição Editorial *</Label>
                    <Textarea
                      placeholder="Descreva os detalhes premium da peça..."
                      rows={3}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="bg-background/50 resize-none"
                    />
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg border border-border/50 md:col-span-2">
                    <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
                    <div className="flex flex-col">
                      <Label className="text-sm font-semibold">Produto Disponível</Label>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">Define se a peça será exibida na vitrine da loja</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção: Galeria Visual */}
              <div className="space-y-4 pt-4 border-t border-border/50">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold font-semibold">
                    <ImageIcon className="h-3 w-3" />
                    Galeria de Imagens
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs hover:bg-gold/10 hover:text-gold"
                    onClick={() =>
                      setForm({
                        ...form,
                        images: [...form.images, { url: "", alt: "", position: form.images.length }],
                      })
                    }
                  >
                    <Plus className="h-3 w-3 mr-1" /> Adicionar Link
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="flex gap-2 items-start bg-muted/10 p-2 rounded-lg border border-border/30 group">
                       <div className="h-10 w-10 bg-charcoal rounded flex-shrink-0 flex items-center justify-center overflow-hidden border border-border/50">
                         {img.url ? <img src={img.url} className="h-full w-full object-cover" /> : <ImageIcon className="h-4 w-4 text-muted-foreground" />}
                       </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                        <Input
                          placeholder="URL da imagem (Cloudinary, Supabase...)"
                          value={img.url}
                          onChange={(e) => {
                            const next = [...form.images];
                            next[idx] = { ...next[idx], url: e.target.value };
                            setForm({ ...form, images: next });
                          }}
                          className="h-8 text-xs bg-transparent"
                        />
                        <Input
                          placeholder="Texto alt (SEO)"
                          value={img.alt ?? ""}
                          onChange={(e) => {
                            const next = [...form.images];
                            next[idx] = { ...next[idx], alt: e.target.value };
                            setForm({ ...form, images: next });
                          }}
                          className="h-8 text-xs bg-transparent"
                        />
                      </div>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() =>
                          setForm({ ...form, images: form.images.filter((_, i) => i !== idx) })
                        }
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                  {form.images.length === 0 && (
                    <p className="text-center text-[11px] text-muted-foreground py-4 border border-dashed border-border/50 rounded-lg">
                      Nenhuma imagem adicionada. Recomenda-se ao menos duas (capa e detalhe).
                    </p>
                  )}
                </div>
              </div>

              {/* Seção: Variantes de Moda */}
              <div className="space-y-4 pt-4 border-t border-border/50">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold font-semibold">
                    <Layers className="h-3 w-3" />
                    Gestão de Variantes (Cor + Tamanho)
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs hover:bg-gold/10 hover:text-gold"
                    onClick={() =>
                      setForm({
                        ...form,
                        variants: [...form.variants, { color: "", size: "", stock: 0, sku: "" }],
                      })
                    }
                  >
                    <Plus className="h-3 w-3 mr-1" /> Nova Variante
                  </Button>
                </div>

                <div className="space-y-3">
                  {form.variants.map((v, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-muted/10 p-2 rounded-lg border border-border/30 group">
                      <div className="col-span-4">
                        <Input
                          placeholder="Ex: Preto"
                          value={v.color}
                          onChange={(e) => {
                            const next = [...form.variants];
                            next[idx] = { ...next[idx], color: e.target.value };
                            setForm({ ...form, variants: next });
                          }}
                          className="h-8 text-xs bg-transparent"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          placeholder="Ex: GG"
                          value={v.size}
                          onChange={(e) => {
                            const next = [...form.variants];
                            next[idx] = { ...next[idx], size: e.target.value };
                            setForm({ ...form, variants: next });
                          }}
                          className="h-8 text-xs bg-transparent text-center"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          min={0}
                          placeholder="Est"
                          value={v.stock}
                          onChange={(e) => {
                            const next = [...form.variants];
                            next[idx] = { ...next[idx], stock: Number(e.target.value) };
                            setForm({ ...form, variants: next });
                          }}
                          className="h-8 text-xs bg-transparent text-center"
                        />
                      </div>
                      <div className="col-span-3">
                        <Input
                          placeholder="SKU"
                          value={v.sku ?? ""}
                          onChange={(e) => {
                            const next = [...form.variants];
                            next[idx] = { ...next[idx], sku: e.target.value };
                            setForm({ ...form, variants: next });
                          }}
                          className="h-8 text-[10px] font-mono bg-transparent"
                        />
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() =>
                            setForm({ ...form, variants: form.variants.filter((_, i) => i !== idx) })
                          }
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {form.variants.length === 0 && (
                    <p className="text-center text-[11px] text-muted-foreground py-4 border border-dashed border-border/50 rounded-lg">
                      Adicione variantes para permitir que o cliente escolha cor e tamanho.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-muted/30 border-t border-border flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setDialogOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button 
              onClick={submit} 
              disabled={saving}
              className="bg-gold text-primary-foreground hover:bg-gold/90 min-w-[140px]"
            >
              {saving ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                editing ? "Salvar Alterações" : "Publicar Produto"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Alerta de Deletar Profissional */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Remover do Catálogo?</AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a remover <span className="text-foreground font-semibold">"{deleteTarget?.name}"</span> permanentemente. 
              Esta ação não pode ser desfeita e afetará o histórico de vendas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting} className="bg-transparent hover:bg-muted">Manter Produto</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Removendo..." : "Sim, Remover"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
