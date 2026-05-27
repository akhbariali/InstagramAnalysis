
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { deviceState, HeaderMapping } from "../globalServices";

export function MyTable({data, staticColumns={},uniqueKey = "device",staticHeader}) {
  return ( 
    <div className="m-auto overflow-x-scroll w-[90%]" dir="ltr">
            <Table className="text-center rounded-lg" striped>
                <TableHead className=" sticky top-0 ">
                    {Object.keys(data[0]).map(header => (
                        <TableHeadCell key={header} className="text-black text-nowrap font-extrabold bg-TextWhite text-sm">
                            {HeaderMapping(header)}
                            <hr className="h-1 bg-black sticky top-0" />
                        </TableHeadCell>
                    ))}
                    {(staticHeader !== undefined) && (
                        <TableHeadCell className="text-black font-extrabold bg-TextWhite text-sm">
                            {staticHeader}
                            <hr className="h-1 bg-black sticky top-0" />
                        </TableHeadCell>
                    )}
                </TableHead>

                <TableBody className="divide-y">
                    {data.map((row, i) => (
                        <TableRow key={i} className="odd:bg-blue-200 odd:text-black even:bg-TextWhite even:text-black">
                            {Object.keys(data[0]).map(cell => (
                                <TableCell key={cell} className="max-w-80 break-all px-3 py-2">
                                    {deviceState(row[cell])}
                                </TableCell>
                            ))}

                            {/* ===== THIS SECTION HAS BEEN CHANGED ===== */}
                            {Array.isArray(staticColumns) && staticColumns.length > 0 && (
                                <TableCell className="whitespace-nowrap font-medium py-2">
                                    {staticColumns.map((staticColumn, index) => {
                                        // Check if content is a function
                                        if (typeof staticColumn.content === 'function') {
                                            // If it's a function, call it with the row and render the returned JSX
                                            return <span key={index}>{staticColumn.content(row)}</span>;
                                        }
                                        // Fallback for static content (optional)
                                        return <span key={index}>{staticColumn.content}</span>;
                                    })}
                                </TableCell>
                            )}
                            {/* ===== END OF CHANGED SECTION ===== */}

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
  );
}
