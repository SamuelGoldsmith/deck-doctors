'use client'
import * as React from "react"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

import { Customer } from "@/lib/utils"

export function CustomerSelect({ customers, initial, onChange }: { customers: Customer[]; initial?: Customer; onChange?: (customer: Customer) => void }) {
  const itemToStringValue = (customer: Customer) => customer.first_name + " " + customer.last_name
  
  const handleChange = (value: string) => {
    const selected = customers.find(c => itemToStringValue(c) === value);
    if (selected && onChange) {
      onChange(selected);
    }
  }
  
  return (
    <div className="w-80">
    <Combobox
    defaultValue={initial ? itemToStringValue(initial) : undefined}
    items={customers}
     itemToStringValue={itemToStringValue}
     onValueChange={handleChange}
    >
      <ComboboxInput placeholder="Select a customer" />

      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>

        <ComboboxList>
          {(customer: Customer) => (
            <ComboboxItem
              key={customer.cid}
              value={customer.first_name + " " + customer.last_name} 
            >
              {customer.first_name} {customer.last_name}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
    </div>
  )
}