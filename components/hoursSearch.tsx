'use client';

import { hoursWithEmployeeAndJob, hoursWorked } from "@/lib/utils";
import { resolveLocationStatus, locationStatusPresentation } from "@/lib/locationVerification";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "./ui/combobox";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, TableCaption, Table } from "./ui/table";
import { useState, useMemo } from "react";
import { Label } from "./ui/label";
import { Field, inputClass } from "./ui/form-field";
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
                if (!hour.date_worked) return false;
                const hourDate = parseISO(hour.date_worked);
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
        () => shownHours.reduce((acc, hour) => acc + hoursWorked(hour) * hour.rate, 0),
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

    const filtersActive = employeeSearch || startDate || endDate || showLastTwoWeeks;

    return (
        <div className="space-y-4">
            <div className="card space-y-4 p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Field label="Search by Employee">
                        <Combobox
                            value={employeeSearch}
                            onValueChange={(val) => handleEmployeeSearchChange(val)}
                        >
                            <ComboboxInput
                                id="employee-search"
                                placeholder="Enter employee name"
                                value={employeeSearch}
                                onChange={(e) => handleEmployeeSearchChange(e.target.value)}
                                className="w-full"
                            />
                            <ComboboxContent>
                                <ComboboxEmpty>No employees found.</ComboboxEmpty>
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
                    </Field>

                    <Field label="Start Date">
                        <input
                            id="start-date"
                            type="date"
                            value={startDate}
                            disabled={showLastTwoWeeks}
                            onChange={(e) => setStartDate(e.target.value)}
                            className={inputClass(false, "disabled:opacity-50 disabled:cursor-not-allowed")}
                        />
                    </Field>

                    <Field label="End Date">
                        <input
                            id="end-date"
                            type="date"
                            value={endDate}
                            disabled={showLastTwoWeeks}
                            onChange={(e) => setEndDate(e.target.value)}
                            className={inputClass(false, "disabled:opacity-50 disabled:cursor-not-allowed")}
                        />
                    </Field>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <button
                            id="last-two-weeks"
                            role="switch"
                            aria-checked={showLastTwoWeeks}
                            onClick={handleLastTwoWeeksToggle}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                                showLastTwoWeeks ? "bg-primary" : "bg-secondary"
                            }`}
                        >
                            <span
                                className={`pointer-events-none block h-5 w-5 rounded-full bg-card shadow-lg ring-0 transition-transform ${
                                    showLastTwoWeeks ? "translate-x-5" : "translate-x-0"
                                }`}
                            />
                        </button>
                        <Label htmlFor="last-two-weeks" className="cursor-pointer select-none text-sm font-medium">
                            Last 2 Weeks
                        </Label>
                    </div>

                    {filtersActive && (
                        <button
                            onClick={() => {
                                setEmployeeSearch("");
                                setStartDate("");
                                setEndDate("");
                                setShowLastTwoWeeks(false);
                            }}
                            className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            </div>

            <p className="text-sm text-muted-foreground">
                Showing {shownHours.length} of {hours.length} records
            </p>

            <div className="overflow-hidden rounded-lg border" style={{ borderColor: "var(--color-border)" }}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Hours</TableHead>
                            <TableHead>Cost</TableHead>
                            <TableHead>Site</TableHead>
                            <TableHead>Location</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {shownHours.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                    No records match the current filters.
                                </TableCell>
                            </TableRow>
                        ) : (
                            shownHours.map((hour) => (
                                <TableRow key={`hour-${hour.hid}`}>
                                    <TableCell>{hour.first_name} {hour.last_name}</TableCell>
                                    <TableCell>
                                        {hour.date_worked
                                            ? new Date(hour.date_worked).toLocaleDateString()
                                            : "—"}
                                    </TableCell>
                                    <TableCell>{hoursWorked(hour)}</TableCell>
                                    <TableCell>${(hoursWorked(hour) * hour.rate).toFixed(2)}</TableCell>
                                    <TableCell>{hour.address}</TableCell>
                                    <TableCell>
                                        {(() => {
                                            const status = resolveLocationStatus(hour);
                                            if (!status) return <span className="text-muted-foreground" title="Location not checked">—</span>;
                                            const p = locationStatusPresentation(status);
                                            const tone =
                                                p.tone === "ok" ? "text-green-700"
                                                    : p.tone === "bad" ? "text-red-600"
                                                        : p.tone === "warn" ? "text-amber-600"
                                                            : "text-muted-foreground";
                                            return <span className={tone} title={p.label}>{p.icon}</span>;
                                        })()}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                    <TableCaption>Total Cost: ${totalCost.toFixed(2)}</TableCaption>
                </Table>
            </div>
        </div>
    );
}
