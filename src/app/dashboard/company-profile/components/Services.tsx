import React, { useState, useEffect, useRef } from "react";
import { FaRegEdit } from "react-icons/fa";
import { FiPlus, FiX } from "react-icons/fi";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ServicesProps {
  services: string[];
  onUpdate: (updates: Partial<{ services: string[] }>) => Promise<void>;
}

const Services: React.FC<ServicesProps> = ({ services, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [currentService, setCurrentService] = useState("");
  const [serviceList, setServiceList] = useState<string[]>(services);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setServiceList(services);
  }, [services]);

  const handleSave = async () => {
    if (currentService) {
      const updatedServices = [...serviceList];
      if (editingIndex !== null) {
        updatedServices[editingIndex] = currentService;
      } else {
        updatedServices.push(currentService);
      }
      await onUpdate({ services: updatedServices });
      setServiceList(updatedServices);
      setCurrentService("");
      setIsAdding(false);
      setEditingIndex(null);
    }
  };
  

  const confirmDelete = (index: number) => {
    setDeleteIndex(index);
    setIsConfirmingDelete(true);
  };

  const handleDelete = async () => {
    if (deleteIndex !== null) {
      const updatedServices = serviceList.filter((_, i) => i !== deleteIndex);
      await onUpdate({ services: updatedServices });
      setServiceList(updatedServices);
      setIsConfirmingDelete(false);
      setDeleteIndex(null);
    }
  };

  const handleEdit = (index: number) => {
    setCurrentService(serviceList[index]);
    setEditingIndex(index);
    setIsAdding(true);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentService(e.target.value);
  };

  return (
    <div className="border rounded-[20px] py-6 px-5">
      <div className="flex justify-between mb-5">
        <h1 className="text-modaltext text-2xl">Services</h1>
        <Dialog open={isAdding} onOpenChange={setIsAdding}>
          <DialogTrigger asChild>
            <FiPlus className="text-signature border rounded-lg p-2 cursor-pointer" size={40} onClick={() => setIsAdding(true)} />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] p-6">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Add Service</DialogTitle>
              <DialogDescription className="text-md text-gray-500">
                Add a new service here. Click save when you are done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="serviceName" className="text-right">
                  Service Name
                </Label>
                <Input
                  id="serviceName"
                  name="serviceName"
                  value={currentService}
                  onChange={handleChange}
                  placeholder="Service Name"
                  className="col-span-3"
                  ref={inputRef}
                />
              </div>
            </div>
            <DialogFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button type="submit" onClick={handleSave}>
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-3 flex-wrap">
        {serviceList.map((service, index) => (
          <div key={index} className="relative flex items-center">
            <Button
              className="bg-bglite text-base text-signature"
              onClick={() => handleEdit(index)}
            >
              {service}
            </Button>
            <FiX
              className="text-red-500 absolute top-0 right-0 p-1 cursor-pointer"
              size={20}
              onClick={() => confirmDelete(index)}
            />
          </div>
        ))}
      </div>

      <Dialog open={isConfirmingDelete} onOpenChange={setIsConfirmingDelete}>
        <DialogContent className="sm:max-w-[400px] p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Confirm Delete</DialogTitle>
            <DialogDescription className="text-md text-gray-500">
              Are you sure you want to delete this service?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsConfirmingDelete(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Services;
