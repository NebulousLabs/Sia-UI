import React from 'react'

const AddFolderDialog = ({ actions }) => {
  const onConfirmClick = e => {
    e.preventDefault()
    actions.addFolder(e.target.name.value)
    actions.hideAddFolderDialog()
  }
  const onCancelClick = () => actions.hideAddFolderDialog()
  return (
    <div className='modal'>
      <div className='addfolder-dialog'>
        <div className='addfolder-text'>Enter a name for the new folder:</div>
        <form className='rename-form' onSubmit={onConfirmClick}>
          <div className='rename-field'>
            <input type='text' name='name' required autoFocus />
          </div>
          <div className='rename-buttons'>
            <button type='submit'>Confirm</button>
            <button type='button' onClick={onCancelClick}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddFolderDialog
