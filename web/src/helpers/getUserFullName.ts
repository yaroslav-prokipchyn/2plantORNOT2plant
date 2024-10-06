export const getUserFullName = ({ firstName, lastName }: {firstName? :string, lastName? : string}): string => {
  return `${firstName} ${lastName}`.trim()
}
