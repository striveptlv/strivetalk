export const useDeleteMode = () => {
  const isDeleteMode = useState('delete-mode', () => false)

  const enableDeleteMode = () => {
    isDeleteMode.value = true
  }

  const disableDeleteMode = () => {
    isDeleteMode.value = false
  }

  const toggleDeleteMode = () => {
    isDeleteMode.value = !isDeleteMode.value
  }

  return {
    isDeleteMode,
    enableDeleteMode,
    disableDeleteMode,
    toggleDeleteMode
  }
}
