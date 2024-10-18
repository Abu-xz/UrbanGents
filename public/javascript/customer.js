function confirmAction (userId, actionType) {
    const action = actionType === 'block' ? 'block' : 'unblock';
    document.getElementById('actionText').textContent = action;
    document.getElementById('confirmModal').classList.remove('hidden');
    // console.log(action);
    
    document.getElementById('confirmBtn').onclick = () =>{
        window.location.href = `/admin/customers/${action}/${userId}`;
        closeModal();
    };
};

function closeModal () {
    document.getElementById('confirmModal').classList.add('hidden');
};

