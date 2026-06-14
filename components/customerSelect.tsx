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
  
  const handleChange = (value: any) => {
    if (value && onChange) {
      const customer = customers.find(c => c.first_name + " " + c.last_name === value);
      if (customer) {
        onChange(customer);
      }
    }
  }
  
  return (
    <Combobox
    items={customers}
     itemToStringValue={itemToStringValue}
     onValueChange={handleChange}
    >
      <ComboboxInput
        className="w-full"
        placeholder={initial ? initial.first_name + " " + initial.last_name : "Select a customer"}
      />

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
  )
}