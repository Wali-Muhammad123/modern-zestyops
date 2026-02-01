import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'

export function StatusSelect() {
  return (
    <NativeSelect>
      <NativeSelectOption value=''>Select status</NativeSelectOption>
      <NativeSelectOption value='active'>Active</NativeSelectOption>
      <NativeSelectOption value='inactive'>Inactive</NativeSelectOption>
    </NativeSelect>
  )
}
