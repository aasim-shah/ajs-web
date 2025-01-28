import { Card } from "@/components/ui/card";
import CompanyCardSm from "./CompanyCardSm";
import CompanyCardMd from "./CompanyCardMd";

const CompanyCard = ({ company, gridView }: any) => {
  return (
    <Card className="bg-background mb-5 p-4 cursor-pointer">
      <div className="md:hidden">
        <CompanyCardSm company={company} />
      </div>
      <div className="hidden md:block">
        {gridView ? (
          <CompanyCardSm company={company} />
        ) : (
          <CompanyCardMd company={company} />
        )}
      </div>
    </Card>
  );
};

export default CompanyCard;
