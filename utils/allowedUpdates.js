function allowedUpdates(fieldToUpdate, allowedUpdates) {
    const updates = Object.keys(fieldToUpdate)
    const isUpdateValid = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    return isUpdateValid
}

module.exports = allowedUpdates