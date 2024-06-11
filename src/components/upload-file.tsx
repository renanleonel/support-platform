'use client';

import { toast } from 'sonner';
import Image from 'next/image';
import { UploadIcon, X } from 'lucide-react';
import { cn, formatBytes } from '@/lib/utils';

import Dropzone, {
    type DropzoneProps,
    type FileRejection,
} from 'react-dropzone';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useControllableState } from '@/hooks/use-controllable-state';

import {
    Dispatch,
    useEffect,
    useCallback,
    HTMLAttributes,
    SetStateAction,
} from 'react';

interface FileUploaderProps extends HTMLAttributes<HTMLDivElement> {
    value?: File[];
    onValueChange?: Dispatch<SetStateAction<File[]>>;
    onUpload?: (files: File[]) => Promise<void>;
    progresses?: Record<string, number>;
    accept?: DropzoneProps['accept'];
    maxSize?: DropzoneProps['maxSize'];
    maxFiles?: DropzoneProps['maxFiles'];
    multiple?: boolean;
    disabled?: boolean;
}

export function FileUploader(props: FileUploaderProps) {
    const {
        value: valueProp,
        onValueChange,
        onUpload,
        progresses,
        accept = { 'image/*': [] },
        maxSize = 1024 * 1024 * 2,
        maxFiles = 1,
        multiple = false,
        disabled = false,
        className,
        ...dropzoneProps
    } = props;

    const [files, setFiles] = useControllableState({
        prop: valueProp,
        onChange: onValueChange,
    });

    const onDrop = useCallback(
        (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
            if (!multiple && maxFiles === 1 && acceptedFiles.length > 1) {
                toast.error('Cannot upload more than 1 file at a time');
                return;
            }

            if ((files?.length ?? 0) + acceptedFiles.length > maxFiles) {
                toast.error(`Cannot upload more than ${maxFiles} files`);
                return;
            }

            const newFiles = acceptedFiles.map((file) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                })
            );

            const updatedFiles = files ? [...files, ...newFiles] : newFiles;

            setFiles(updatedFiles);

            if (rejectedFiles.length > 0) {
                rejectedFiles.forEach(({ file }) => {
                    toast.error(`Unable to upload file ${file.name}`);
                });
            }

            if (
                onUpload &&
                updatedFiles.length > 0 &&
                updatedFiles.length <= maxFiles
            ) {
                const target =
                    updatedFiles.length > 0
                        ? `${updatedFiles.length} files`
                        : `file`;

                toast.promise(onUpload(updatedFiles), {
                    loading: `Uploading ${target}...`,
                    success: () => {
                        setFiles([]);
                        return `${target} uploaded`;
                    },
                    error: `Failed to upload ${target}`,
                });
            }
        },

        [files, maxFiles, multiple, onUpload, setFiles]
    );

    function onRemove(index: number) {
        if (!files) return;
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);
        onValueChange?.(newFiles);
    }

    useEffect(() => {
        return () => {
            if (!files) return;
            files.forEach((file) => {
                if (isFileWithPreview(file)) {
                    URL.revokeObjectURL(file.preview);
                }
            });
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isDisabled = disabled || (files?.length ?? 0) >= maxFiles;

    return (
        <div className='relative flex flex-col gap-6 overflow-hidden'>
            <Dropzone
                onDrop={onDrop}
                accept={accept}
                maxSize={maxSize}
                maxFiles={maxFiles}
                multiple={maxFiles > 1 || multiple}
                disabled={isDisabled}
            >
                {({ getRootProps, getInputProps, isDragActive }) => (
                    <div className='p-4 md:p-0'>
                        <div
                            {...getRootProps()}
                            className={cn(
                                'group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border border-dashed border-muted-foreground/25 px-5 py-2.5 text-center ring-offset-background transition hover:bg-muted/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                                isDragActive && 'border-muted-foreground/50',
                                isDisabled && 'pointer-events-none opacity-60',
                                className
                            )}
                            {...dropzoneProps}
                        >
                            <input {...getInputProps()} />
                            {isDragActive ? (
                                <div className='flex flex-col items-center justify-center gap-4 sm:px-5'>
                                    <UploadIcon
                                        className='size-5 text-muted-foreground'
                                        aria-hidden='true'
                                    />
                                    <p className='font-medium text-muted-foreground'>
                                        Drop the files here
                                    </p>
                                </div>
                            ) : (
                                <div className='flex flex-col items-center justify-center gap-4 sm:px-5'>
                                    <UploadIcon
                                        className='size-5 text-muted-foreground'
                                        aria-hidden='true'
                                    />
                                    <div className='space-y-px'>
                                        <p className='font-medium text-muted-foreground'>
                                            Drop files here or click to upload
                                        </p>
                                        <p className='text-sm text-muted-foreground/70'>
                                            You can upload
                                            {maxFiles > 1
                                                ? ` ${maxFiles === Infinity ? 'multiple' : maxFiles}
                      files (up to ${formatBytes(maxSize)} each)`
                                                : ` a file with ${formatBytes(maxSize)}`}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Dropzone>
            {files?.length ? (
                <ScrollArea className='h-fit w-full px-3'>
                    <div className='max-h-48 space-y-4'>
                        {files?.map((file, index) => (
                            <FileCard
                                key={index}
                                file={file}
                                onRemove={() => onRemove(index)}
                                progress={progresses?.[file.name]}
                            />
                        ))}
                    </div>
                </ScrollArea>
            ) : null}
        </div>
    );
}

interface FileCardProps {
    file: File;
    onRemove: () => void;
    progress?: number;
}

function FileCard({ file, progress, onRemove }: FileCardProps) {
    return (
        <div className='relative flex items-center space-x-4'>
            <div className='flex flex-1 space-x-4'>
                {isFileWithPreview(file) && (
                    <Image
                        src={file.preview}
                        alt={file.name}
                        width={48}
                        height={48}
                        loading='lazy'
                        className='aspect-square shrink-0 rounded-md object-cover'
                    />
                )}
                <div className='flex w-full flex-col gap-2'>
                    <div className='space-y-px'>
                        <p className='line-clamp-1 text-sm font-medium text-foreground/80'>
                            {file.name}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                            {formatBytes(file.size)}
                        </p>
                    </div>
                    {progress ? <Progress value={progress} /> : null}
                </div>
            </div>
            <div className='flex items-center gap-2'>
                <Button
                    type='button'
                    variant='outline'
                    size='icon'
                    className='size-7'
                    onClick={onRemove}
                >
                    <span className='sr-only'>Remove file</span>
                    <X className='size-4' aria-hidden='true' />
                </Button>
            </div>
        </div>
    );
}

function isFileWithPreview(file: File): file is File & { preview: string } {
    return 'preview' in file && typeof file.preview === 'string';
}
