import { CheckCircle, Smile, Award, Package } from "lucide-react";

const features = [
  {
    icon: CheckCircle,
    title: "Qualidade Premium",
    description: "Materiais selecionados para garantir conforto e durabilidade no dia a dia.",
  },
  {
    icon: Smile,
    title: "Conforto Garantido",
    description: "Design pensado para proporcionar o máximo de conforto em qualquer ocasião.",
  },
  {
    icon: Award,
    title: "Acabamento Impecável",
    description: "Costuras reforçadas e acabamento de alta qualidade em cada detalhe.",
  },
  {
    icon: Package,
    title: "Excelente Custo-Benefício",
    description: "Produto premium com preço justo e entrega para todo o Brasil.",
  },
];

const QualityFeatures = () => {
  return (
    <div className="mt-10 space-y-4 max-w-xl mx-auto">
      {features.map((feature, idx) => {
        const Icon = feature.icon;
        return (
          <div
            key={idx}
            className="flex items-start gap-4 bg-secondary/50 border border-border rounded-xl p-5"
          >
            <div className="w-10 h-10 rounded-lg bg-foreground flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-background" />
            </div>
            <div>
              <p className="font-bold text-foreground text-sm">{feature.title}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QualityFeatures;
