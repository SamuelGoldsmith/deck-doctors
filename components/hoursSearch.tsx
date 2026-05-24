'use client';

import { deleteExpense, Employee, hoursWithEmployeeAndJob } from "@/lib/utils";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "./ui/combobox";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, TableCaption, Table } from "./ui/table";
import { useState, useMemo } from "react";
import { Label } from "./ui/label";
import { subDays, parseISO, isWithinInterval, startOfDay, endOfDay, isValid } from "date-fns";

export default function HoursSearch({ hours }: { hours: hoursWithEmployeeAndJob[] }) {
    const [employeeSearch, setEmployeeSearch] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [showLastTwoWeeks, setShowLastTwoWeeks] = useState<boolean>(false);

    const groupedByEmployee = useMemo(() => {
        const grouped: { [key: string]: { hours: hoursWithEmployeeAndJob[] } } = {};
        hours.forEach((hour) => {
            const employeeName = `${hour.first_name} ${hour.last_name}`;
            if (!grouped[employeeName]) grouped[employeeName] = { hours: [] };
            grouped[employeeName].hours.push(hour);
        });
        return grouped;
    }, [hours]);

    const effectiveStartDate = useMemo(() => {
        if (showLastTwoWeeks) return subDays(startOfDay(new Date()), 14);
        if (startDate) {
            const parsed = parseISO(startDate);
            return isValid(parsed) ? startOfDay(parsed) : null;
        }
        return null;
    }, [showLastTwoWeeks, startDate]);

    const effectiveEndDate = useMemo(() => {
        if (showLastTwoWeeks) return endOfDay(new Date());
        if (endDate) {
            const parsed = parseISO(endDate);
            return isValid(parsed) ? endOfDay(parsed) : null;
        }
        return null;
    }, [showLastTwoWeeks, endDate]);

    const shownHours = useMemo(() => {
        return hours.filter((hour) => {
            if (employeeSearch) {
                const employeeName = `${hour.first_name} ${hour.last_name}`;
                if (!employeeName.toLowerCase().includes(employeeSearch.toLowerCase())) return false;
            }

            if (effectiveStartDate || effectiveEndDate) {
                if (!hour.start_date) return false;
                const hourDate = parseISO(hour.start_date);
                if (!isValid(hourDate)) return false;

                if (effectiveStartDate && effectiveEndDate) {
                    if (!isWithinInterval(hourDate, { start: effectiveStartDate, end: effectiveEndDate })) return false;
                } else if (effectiveStartDate) {
                    if (hourDate < effectiveStartDate) return false;
                } else if (effectiveEndDate) {
                    if (hourDate > effectiveEndDate) return false;
                }
            }

            return true;
        });
    }, [hours, employeeSearch, effectiveStartDate, effectiveEndDate]);

    const totalCost = useMemo(
        () => shownHours.reduce((acc, hour) => acc + hour.hours * hour.rate, 0),
        [shownHours]
    );

    const handleEmployeeSearchChange = (value: any) => {
        setEmployeeSearch(value);
    };

    const handleLastTwoWeeksToggle = () => {
        const next = !showLastTwoWeeks;
        setShowLastTwoWeeks(next);
        if (next) {
            setStartDate("");
            setEndDate("");
        }
    };

    return (
        <div className="mb-4 space-y-4">
            <div>
                <Label htmlFor="employee-search" className="mb-1">Search by Employee</Label>
                <Combobox
                    value={employeeSearch}
                    onValueChange={(val) => handleEmployeeSearchChange(val)}
                >
                    <ComboboxInput
                        id="employee-search"
                        placeholder="Enter employee name"
                        value={employeeSearch}
                        onChange={(e) => handleEmployeeSearchChange(e.target.value)}
                    />
                    <ComboboxContent>
                        <ComboboxList>
                            {Object.keys(groupedByEmployee)
                                .filter((name) =>
                                    employeeSearch === "" ||
                                    name.toLowerCase().includes(employeeSearch.toLowerCase())
                                )
                                .map((employeeName) => (
                                    <ComboboxItem
                                        key={employeeName}
                                        value={employeeName}
                                    >
                                        {employeeName}
                                    </ComboboxItem>
                                ))}
                        </ComboboxList>
                    </ComboboxContent>
                </Combobox>
            </div>

            {/* Date range + toggle row */}
            <div className="flex flex-wrap items-end gap-4">
                {/* Start date */}
                <div className="flex flex-col gap-1">
                    <Label htmlFor="start-date">Start Date</Label>
                    <input
                        id="start-date"
                        type="date"
                        value={startDate}
                        disabled={showLastTwoWeeks}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border border-input rounded-md px-3 py-2 text-sm bg-background text-foreground disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>

                {/* End date */}
                <div className="flex flex-col gap-1">
                    <Label htmlFor="end-date">End Date</Label>
                    <input
                        id="end-date"
                        type="date"
                        value={endDate}
                        disabled={showLastTwoWeeks}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border border-input rounded-md px-3 py-2 text-sm bg-background text-foreground disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>

                <div className="flex items-center gap-2 pb-2">
                    <button
                        id="last-two-weeks"
                        role="switch"
                        aria-checked={showLastTwoWeeks}
                        onClick={handleLastTwoWeeksToggle}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                            showLastTwoWeeks ? "bg-amber-500" : "bg-amber-800"
                        }`}
                    >
                        <span
                            className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform ${
                                showLastTwoWeeks ? "translate-x-5" : "translate-x-0"
                            }`}
                        />
                    </button>
                    <Label htmlFor="last-two-weeks" className="cursor-pointer select-none">
                        Last 2 Weeks
                    </Label>
                </div>

                {(employeeSearch || startDate || endDate || showLastTwoWeeks) && (
                    <div className="p-2 border border-border bg-amber-800 rounded-md">
                        <button
                            onClick={() => {
                                setEmployeeSearch("");
                                setStartDate("");
                                setEndDate("");
                                setShowLastTwoWeeks(false);
                            }}
                            className="text-sm text-amber-50 hover:text-foreground transition-colors"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>

            {/* Results summary */}
            <p className="text-sm text-muted-foreground">
                Showing {shownHours.length} of {hours.length} records
            </p>

            {/* Table */}
            <Table>
                <TableHeader>
                    <TableRow className="text-xl">
                        <TableHead>Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Count</TableHead>
                        <TableHead>Cost</TableHead>
                        <TableHead>Site</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="w-10/11">
                    {shownHours.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                No records match the current filters.
                            </TableCell>
                        </TableRow>
                    ) : (
                        shownHours.map((hour, i) => (
                            <TableRow
                                key={`hour-${hour.hid}`}
                                className={`${
                                    i % 2 === 0
                                        ? "bg-background hover:bg-secondary"
                                        : "bg-secondary hover:bg-background"
                                }`}
                            >
                                <TableCell>{hour.first_name} {hour.last_name}</TableCell>
                                <TableCell>
                                    {hour.start_date
                                        ? new Date(hour.start_date).toLocaleDateString()
                                        : "—"}
                                </TableCell>
                                <TableCell>{hour.hours}</TableCell>
                                <TableCell>${(hour.hours * hour.rate).toFixed(2)}</TableCell>
                                <TableCell>{hour.address}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
                <TableCaption>Total Cost: ${totalCost.toFixed(2)}</TableCaption>
            </Table>
        </div>
    );
}
