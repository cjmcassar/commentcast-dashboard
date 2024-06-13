import ConsoleAndNetworkTableLoading from '@/components/layouts/issue-details/ConsoleAndNetworkTableLoading';
import { Issue } from '@/types/issue';

import React from 'react';

import Image from 'next/image';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type Props = {
  browserConsoleData: Issue['browser_console_data'];
  networkData: Issue['browser_network_data'];
  handleCopyToClipboard: (text: string, label: string) => void;
};

interface ProcessedData {
  exceptions: Record<string, Record<string, { count: number }>>;
  args: Record<string, Record<string, number>>;
}

export default function ConsoleAndNetworkTable({
  browserConsoleData,
  networkData,
  handleCopyToClipboard,
}: Props) {
  //   console.log('networkData', networkData);

  const processedData = browserConsoleData.reduce(
    (acc, log) => {
      if (log.exceptionDetails?.exception.description) {
        const { description } = log.exceptionDetails.exception;
        const { text: exceptionType } = log.exceptionDetails;
        if (exceptionType) {
          acc.exceptions[exceptionType] = acc.exceptions[exceptionType] || {};
          acc.exceptions[exceptionType][description] = {
            count: (acc.exceptions[exceptionType][description]?.count ?? 0) + 1,
          };
        }
      } else if (log.args?.length ?? 0 > 0) {
        const type = log.type ?? '';
        const value = log.args?.[0].value ?? '';
        acc.args[type] = acc.args[type] || {};
        acc.args[type][value] =
          ((acc.args[type][value] as number | undefined) ?? 0) + 1;
      }
      return acc;
    },
    { exceptions: {}, args: {} } as ProcessedData
  );

  const handleSearchWithGoogle = (logText: string) => {
    const query = encodeURIComponent(logText);
    const url = `https://www.google.com/search?q=${query}`;
    window.open(url, '_blank');
  };

  return (
    <div className="mt-4 grid grid-cols-1 gap-1">
      <Card className="overflow-hidden min-w-[300px] sm:min-w-[400px] md:min-w-[500px] lg:min-w-[1000px]">
        <CardHeader>
          <CardTitle>Console Logs</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(processedData.exceptions).length === 0 &&
          Object.keys(processedData.args).length === 0 ? (
            <ConsoleAndNetworkTableLoading />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    Console - (
                    {Object.keys(processedData.exceptions).length === 1
                      ? '1 Exception Type'
                      : `${Object.keys(processedData.exceptions).length} Exception Types`}
                    ,{' '}
                    {Object.keys(processedData.args).length === 1
                      ? '1 Log Type'
                      : `${Object.keys(processedData.args).length} Log Types`}
                    )
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium w-[100px] max-w-[100px] ">
                    <Tooltip>
                      <TooltipTrigger className="text-start">
                        <ScrollArea className="h-72">
                          {Object.entries(processedData.exceptions).map(
                            ([exceptionType, descriptions]) => (
                              <div key={exceptionType}>
                                <span
                                  className={`${
                                    exceptionType === 'Uncaught'
                                      ? 'text-red-500'
                                      : 'text-gray-500'
                                  }`}
                                >
                                  {exceptionType}:{''}
                                </span>

                                <ul key={exceptionType}>
                                  {Object.entries(descriptions).map(
                                    ([description, { count }]) => (
                                      <ContextMenu key={description}>
                                        <ContextMenuTrigger asChild>
                                          <li
                                            key={description}
                                            className="ml-4 list-disc break-words cursor-pointer hover:bg-gray-300"
                                            onClick={() => {
                                              handleCopyToClipboard(
                                                description,
                                                `${exceptionType} Type`
                                              );
                                            }}
                                          >
                                            <span>{description}</span>

                                            <strong> ({count})</strong>
                                          </li>
                                        </ContextMenuTrigger>

                                        <ContextMenuContent>
                                          <ContextMenuItem
                                            onClick={() => {
                                              handleSearchWithGoogle(
                                                description
                                              );
                                            }}
                                          >
                                            <a className="mr-2">
                                              <Image
                                                src="https://cdn3.emoji.gg/emojis/8515-google.png"
                                                width={16}
                                                height={16}
                                                alt="Google"
                                              />
                                            </a>{' '}
                                            Search With Google
                                          </ContextMenuItem>
                                        </ContextMenuContent>
                                      </ContextMenu>
                                    )
                                  )}
                                </ul>
                              </div>
                            )
                          )}

                          {Object.entries(processedData.args).map(
                            ([type, logs]) => (
                              <div key={type}>
                                <span
                                  className={`${
                                    type === 'error'
                                      ? 'text-red-500'
                                      : type === 'warning'
                                        ? 'text-yellow-500'
                                        : type === 'info'
                                          ? 'text-blue-500'
                                          : 'text-gray-500'
                                  }`}
                                >
                                  {type}:{' '}
                                </span>
                                <ul key={type}>
                                  {Object.entries(logs).map(
                                    ([value, count]) => (
                                      <ContextMenu key={value}>
                                        <ContextMenuTrigger asChild>
                                          <li
                                            key={value}
                                            className="ml-4 list-disc break-words cursor-pointer hover:bg-gray-300"
                                            onClick={() => {
                                              handleCopyToClipboard(
                                                value,
                                                type
                                              );
                                            }}
                                          >
                                            {`${value}`}
                                            <strong className="text-bold">
                                              {' '}
                                              {`(${count})`}
                                            </strong>
                                          </li>
                                        </ContextMenuTrigger>
                                        <ContextMenuContent>
                                          <ContextMenuItem
                                            onClick={() => {
                                              handleSearchWithGoogle(value);
                                            }}
                                          >
                                            <a className="mr-2">
                                              <Image
                                                src="https://cdn3.emoji.gg/emojis/8515-google.png"
                                                width={16}
                                                height={16}
                                                alt="Google"
                                              />
                                            </a>{' '}
                                            Search With Google
                                          </ContextMenuItem>
                                        </ContextMenuContent>
                                      </ContextMenu>
                                    )
                                  )}
                                </ul>
                              </div>
                            )
                          )}
                        </ScrollArea>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-center">
                          <strong>Click to copy</strong> and{' '}
                          <strong>right click</strong> for options
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
