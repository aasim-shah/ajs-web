import React from 'react';
import Checkbox from '../../../repeatComponents/Checkbox';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { GoSidebarCollapse } from 'react-icons/go';

interface SidebarProps {
  onCheckboxChange: (filter: string) => void;
  selectedFilters: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ onCheckboxChange, selectedFilters }) => {
  return (
    <>
      <div className="md:w-1/4 md:block hidden">
        <div className="bg-mutedLight rounded-xl p-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-base">Job Type</AccordionTrigger>
              <AccordionContent>
                <Checkbox id="full-time" checked={selectedFilters.includes("full-time")} onChange={() => onCheckboxChange("full-time")}>
                  Full-Time
                </Checkbox>
                <Checkbox id="part-time" checked={selectedFilters.includes("part-time")} onChange={() => onCheckboxChange("part-time")}>
                  Part-Time
                </Checkbox>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-base">Categories</AccordionTrigger>
              <AccordionContent>
                <Checkbox id="design" checked={selectedFilters.includes("design")} onChange={() => onCheckboxChange("design")}>
                  Design
                </Checkbox>
                <Checkbox id="sales" checked={selectedFilters.includes("sales")} onChange={() => onCheckboxChange("sales")}>
                  Sales
                </Checkbox>
                <Checkbox id="marketing" checked={selectedFilters.includes("marketing")} onChange={() => onCheckboxChange("marketing")}>
                  Marketing
                </Checkbox>
                <Checkbox id="business" checked={selectedFilters.includes("business")} onChange={() => onCheckboxChange("business")}>
                  Business
                </Checkbox>
                <Checkbox id="human-resource" checked={selectedFilters.includes("human-resource")} onChange={() => onCheckboxChange("human-resource")}>
                  Human Resource
                </Checkbox>
                <Checkbox id="finance" checked={selectedFilters.includes("finance")} onChange={() => onCheckboxChange("finance")}>
                  Finance
                </Checkbox>
                <Checkbox id="engineering" checked={selectedFilters.includes("engineering")} onChange={() => onCheckboxChange("engineering")}>
                  Engineering
                </Checkbox>
                <Checkbox id="technology" checked={selectedFilters.includes("technology")} onChange={() => onCheckboxChange("technology")}>
                  Technology
                </Checkbox>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-base">Career Level</AccordionTrigger>
              <AccordionContent>
                <Checkbox id="entry-level" checked={selectedFilters.includes("entry-level")} onChange={() => onCheckboxChange("entry-level")}>
                  Entry Level
                </Checkbox>
                <Checkbox id="middle" checked={selectedFilters.includes("middle")} onChange={() => onCheckboxChange("middle")}>
                  Middle
                </Checkbox>
                <Checkbox id="senior" checked={selectedFilters.includes("senior")} onChange={() => onCheckboxChange("senior")}>
                  Senior
                </Checkbox>
                <Checkbox id="executive" checked={selectedFilters.includes("executive")} onChange={() => onCheckboxChange("executive")}>
                  Executive
                </Checkbox>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-base">Candidate Type</AccordionTrigger>
              <AccordionContent>
                <Checkbox id="remote" checked={selectedFilters.includes("remote")} onChange={() => onCheckboxChange("remote")}>
                  Remote
                </Checkbox>
                <Checkbox id="contract" checked={selectedFilters.includes("contract")} onChange={() => onCheckboxChange("contract")}>
                  Contract
                </Checkbox>
                <Checkbox id="internship" checked={selectedFilters.includes("internship")} onChange={() => onCheckboxChange("internship")}>
                  Internship
                </Checkbox>
                <Checkbox id="foreigner" checked={selectedFilters.includes("foreigner")} onChange={() => onCheckboxChange("foreigner")}>
                  Foreigner
                </Checkbox>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger className="text-base">Salary Range</AccordionTrigger>
              <AccordionContent>
                <Checkbox id="15000-25000" checked={selectedFilters.includes("15000-25000")} onChange={() => onCheckboxChange("15000-25000")}>
                  $15k - $25k/Monthly
                </Checkbox>
                <Checkbox id="25000-35000" checked={selectedFilters.includes("25000-35000")} onChange={() => onCheckboxChange("25000-35000")}>
                  $25k - $35k/Monthly
                </Checkbox>
                <Checkbox id="35000-45000" checked={selectedFilters.includes("35000-45000")} onChange={() => onCheckboxChange("35000-45000")}>
                  $35k - $45k/Monthly
                </Checkbox>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <div className="md:hidden block">
        <Sheet>
          <SheetTrigger><GoSidebarCollapse size={30} /></SheetTrigger>
          <SheetContent className="w-full">
            <div className="bg-muted rounded-lg p-4 mt-5">
              <Accordion type="single" collapsible className="w-full ">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-base">Job Type</AccordionTrigger>
                  <AccordionContent>
                    <Checkbox id="full-time" checked={selectedFilters.includes("full-time")} onChange={() => onCheckboxChange("full-time")}>
                      Full-Time
                    </Checkbox>
                    <Checkbox id="part-time" checked={selectedFilters.includes("part-time")} onChange={() => onCheckboxChange("part-time")}>
                      Part-Time
                    </Checkbox>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-base">Categories</AccordionTrigger>
                  <AccordionContent>
                    <Checkbox id="design" checked={selectedFilters.includes("design")} onChange={() => onCheckboxChange("design")}>
                      Design
                    </Checkbox>
                    <Checkbox id="sales" checked={selectedFilters.includes("sales")} onChange={() => onCheckboxChange("sales")}>
                      Sales
                    </Checkbox>
                    <Checkbox id="marketing" checked={selectedFilters.includes("marketing")} onChange={() => onCheckboxChange("marketing")}>
                      Marketing
                    </Checkbox>
                    <Checkbox id="business" checked={selectedFilters.includes("business")} onChange={() => onCheckboxChange("business")}>
                      Business
                    </Checkbox>
                    <Checkbox id="human-resource" checked={selectedFilters.includes("human-resource")} onChange={() => onCheckboxChange("human-resource")}>
                      Human Resource
                    </Checkbox>
                    <Checkbox id="finance" checked={selectedFilters.includes("finance")} onChange={() => onCheckboxChange("finance")}>
                      Finance
                    </Checkbox>
                    <Checkbox id="engineering" checked={selectedFilters.includes("engineering")} onChange={() => onCheckboxChange("engineering")}>
                      Engineering
                    </Checkbox>
                    <Checkbox id="technology" checked={selectedFilters.includes("technology")} onChange={() => onCheckboxChange("technology")}>
                      Technology
                    </Checkbox>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-base">Career Level</AccordionTrigger>
                  <AccordionContent>
                    <Checkbox id="entry-level" checked={selectedFilters.includes("entry-level")} onChange={() => onCheckboxChange("entry-level")}>
                      Entry Level
                    </Checkbox>
                    <Checkbox id="middle" checked={selectedFilters.includes("middle")} onChange={() => onCheckboxChange("middle")}>
                      Middle
                    </Checkbox>
                    <Checkbox id="senior" checked={selectedFilters.includes("senior")} onChange={() => onCheckboxChange("senior")}>
                      Senior
                    </Checkbox>
                    <Checkbox id="executive" checked={selectedFilters.includes("executive")} onChange={() => onCheckboxChange("executive")}>
                      Executive
                    </Checkbox>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-base">Candidate Type</AccordionTrigger>
                  <AccordionContent>
                    <Checkbox id="remote" checked={selectedFilters.includes("remote")} onChange={() => onCheckboxChange("remote")}>
                      Remote
                    </Checkbox>
                    <Checkbox id="contract" checked={selectedFilters.includes("contract")} onChange={() => onCheckboxChange("contract")}>
                      Contract
                    </Checkbox>
                    <Checkbox id="internship" checked={selectedFilters.includes("internship")} onChange={() => onCheckboxChange("internship")}>
                      Internship
                    </Checkbox>
                    <Checkbox id="foreigner" checked={selectedFilters.includes("foreigner")} onChange={() => onCheckboxChange("foreigner")}>
                      Foreigner
                    </Checkbox>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-base">Salary Range</AccordionTrigger>
                  <AccordionContent>
                    <Checkbox id="15000-25000" checked={selectedFilters.includes("15000-25000")} onChange={() => onCheckboxChange("15000-25000")}>
                      $15k - $25k/Monthly
                    </Checkbox>
                    <Checkbox id="25000-35000" checked={selectedFilters.includes("25000-35000")} onChange={() => onCheckboxChange("25000-35000")}>
                      $25k - $35k/Monthly
                    </Checkbox>
                    <Checkbox id="35000-45000" checked={selectedFilters.includes("35000-45000")} onChange={() => onCheckboxChange("35000-45000")}>
                      $35k - $45k/Monthly
                    </Checkbox>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default Sidebar;
