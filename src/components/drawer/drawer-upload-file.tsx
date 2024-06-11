import { useMediaQuery } from '@/hooks/use-media-query';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { FileUploader } from '../upload-file';
import { SetStateAction, useState } from 'react';

interface DialogUploadFileProps {
    files: File[];
    setFiles: React.Dispatch<SetStateAction<File[]>>;
}

export function DialogUploadFile({ files, setFiles }: DialogUploadFileProps) {
    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery('(min-width: 768px)');

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant='outline'
                        className='justify-start truncate text-muted-foreground'
                    >
                        {files.map((file) => file.name).join(', ') ||
                            'Upload files'}
                    </Button>
                </DialogTrigger>
                <DialogContent className='sm:max-w-xl'>
                    <DialogHeader>
                        <DialogTitle>Upload files</DialogTitle>
                        <DialogDescription>
                            Drop your files here or click to browse.
                        </DialogDescription>
                    </DialogHeader>
                    <FileUploader
                        maxFiles={3}
                        maxSize={3 * 1024 * 1024}
                        value={files}
                        onValueChange={setFiles}
                    />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button
                    variant='outline'
                    className='justify-start truncate text-muted-foreground'
                >
                    {files.map((file) => file.name).join(', ') ||
                        'Upload files'}
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className='text-left'>
                    <DrawerTitle>Upload files</DrawerTitle>
                    <DrawerDescription>
                        Drop your files here or click to browse.
                    </DrawerDescription>
                </DrawerHeader>
                <FileUploader
                    maxFiles={3}
                    maxSize={3 * 1024 * 1024}
                    value={files}
                    onValueChange={setFiles}
                />
            </DrawerContent>
        </Drawer>
    );
}
