"use client";

import { useRef, useState, useTransition, type FormEvent } from "react";
import { FileUp, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type CurriculumPackageOption = {
  id: string;
  name: string;
};

type CurriculumDocumentUploadFormProps = {
  curriculumVersionId: string;
  packages: CurriculumPackageOption[];
};

export default function CurriculumDocumentUploadForm({
  curriculumVersionId,
  packages,
}: CurriculumDocumentUploadFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [open, setOpen] = useState(false);
  const [documentType, setDocumentType] = useState("CURRICULUM");
  const [packageId, setPackageId] = useState("NONE");
  const [isPrimarySource, setIsPrimarySource] = useState(false);
  const [pending, startTransition] = useTransition();

  function resetForm() {
    formRef.current?.reset();
    setDocumentType("CURRICULUM");
    setPackageId("NONE");
    setIsPrimarySource(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    formData.set("curriculumVersionId", curriculumVersionId);
    formData.set("documentType", documentType);
    formData.set("isPrimarySource", String(isPrimarySource));

    if (packageId === "NONE") {
      formData.delete("curriculumPackageId");
    } else {
      formData.set("curriculumPackageId", packageId);
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/curriculum-documents", {
          method: "POST",
          body: formData,
        });

        const result = (await response.json()) as {
          success: boolean;
          message: string;
        };

        if (!response.ok || !result.success) {
          toast.error(result.message);
          return;
        }

        toast.success(result.message);
        resetForm();
        setOpen(false);
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("The document could not be uploaded.");
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);

        if (!nextOpen) {
          resetForm();
        }
      }}>
      <DialogTrigger asChild>
        <Button className="bg-blue-700 hover:bg-blue-800">
          <FileUp className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Upload curriculum document</DialogTitle>

          <DialogDescription>
            Add an official curriculum, pacing guide, framework, standards
            document, or teacher guide.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} onSubmit={handleSubmit} className="mt-4 space-y-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                name="title"
                placeholder="Grade 5 Mathematics Curriculum"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Document type</Label>

              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="CURRICULUM">Curriculum</SelectItem>
                  <SelectItem value="PACING_GUIDE">Pacing Guide</SelectItem>
                  <SelectItem value="SCOPE_AND_SEQUENCE">
                    Scope and Sequence
                  </SelectItem>
                  <SelectItem value="STANDARDS">Standards</SelectItem>
                  <SelectItem value="FRAMEWORK">Framework</SelectItem>
                  <SelectItem value="ASSESSMENT_GUIDE">
                    Assessment Guide
                  </SelectItem>
                  <SelectItem value="TEACHER_GUIDE">Teacher Guide</SelectItem>
                  <SelectItem value="RESOURCE_GUIDE">Resource Guide</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label>File</Label>

              <Input
                name="file"
                type="file"
                accept=".pdf,.docx,.xlsx,.csv"
                required
              />

              <p className="text-xs text-slate-500">
                Supported formats: PDF, DOCX, XLSX, and CSV.
              </p>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label>Curriculum package</Label>

              <Select value={packageId} onValueChange={setPackageId}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="NONE">
                    Entire curriculum version
                  </SelectItem>

                  {packages.map((curriculumPackage) => (
                    <SelectItem
                      key={curriculumPackage.id}
                      value={curriculumPackage.id}>
                      {curriculumPackage.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Issued date</Label>
              <Input name="issuedDate" type="date" />
            </div>

            <div className="space-y-2">
              <Label>Effective date</Label>
              <Input name="effectiveDate" type="date" />
            </div>

            <div className="space-y-2">
              <Label>Expiration date</Label>
              <Input name="expirationDate" type="date" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>

            <Textarea
              name="description"
              rows={4}
              placeholder="Describe the document and its role in this curriculum version..."
            />
          </div>

          <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <Checkbox
              checked={isPrimarySource}
              onCheckedChange={(checked) =>
                setIsPrimarySource(checked === true)
              }
            />

            <div>
              <p className="text-sm font-bold text-slate-800">
                Primary curriculum source
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Mark this as the authoritative source document for the
                curriculum version.
              </p>
            </div>
          </label>

          <Button
            type="submit"
            disabled={pending}
            className="w-full bg-blue-700 hover:bg-blue-800">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

            {pending ? "Uploading..." : "Upload Document"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
