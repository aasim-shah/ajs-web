import React from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
const ApplicationDialog = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button className="bg-signature text-background text-sm px-8 py-2 rounded-md">
          Apply
        </Button>
      </DialogTrigger>
      <DialogContent className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-background rounded-lg shadow-lg w-full max-w-2xl h-3/4 overflow-y-auto">
          <DialogHeader className="bg-signature  px-16 py-5 rounded-t-lg flex justify-center text-center">
            <DialogTitle className=" text-background text-center text-3xl">
              Review your Information
            </DialogTitle>
          </DialogHeader>
          <div className="px-16 py-4">
            <DialogDescription>
              <div>
                <h1 className="modaltext text-2xl">Submit your application</h1>
                <p className="text-signininput4">
                  The following is required and will only be shared
                </p>
              </div>

              <form className="space-y-4 mt-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input type="text" id="full-name" placeholder="Full Name" />
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="email">Email Address</Label>
                  <Input type="email" id="email" placeholder="Email Address" />
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input type="tel" id="phone" placeholder="Phone Number" />
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="job-title">Current or Previous Job Title</Label>
                  <Input type="text" id="job-title" placeholder="Current or Previous Job Title" />
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input type="url" id="linkedin" placeholder="LinkedIn URL" />
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="additional-info">Additional Information</Label>
                  <textarea id="additional-info" placeholder="Additional Information" className="w-full p-2 border border-gray-300 rounded"></textarea>
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="resume">Attach Your Resume</Label>
                  <Input type="file" id="resume" />
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <div className="flex items-center">
                    <Input type="checkbox" id="terms" className="h-4 w-4 text-green-600 border-gray-300 rounded" />
                    <Label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                      I agree to the terms and conditions
                    </Label>
                  </div>
                </div>

                <button type="submit" className="w-full py-2 px-4 bg-green-600 text-background rounded hover:bg-green-700">
                  Submit Application
                </button>
              </form>
            </DialogDescription>
            <div className="px-16 pb-10">
              <Button className="w-full px-24 py-6  text-background text-sm rounded-md"  >
             
                  Go to My Profile
          
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDialog;
