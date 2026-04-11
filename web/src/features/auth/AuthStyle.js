export const AuthStyle = {
    card: {
        padding: '40px',
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        width: '420px',
        margin: 'auto',
        boxSizing: 'border-box' // Prevents elements from leaking out
    },
    title: { color: '#1E293B', marginBottom: '8px', fontSize: '24px', fontWeight: 'bold', textAlign: 'center' },
    subtitle: { color: '#64748B', fontSize: '14px', marginBottom: '24px', textAlign: 'center' },
    form: { display: 'flex', flexDirection: 'column', textAlign: 'left' },
    label: { fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px' },
    input: {
        padding: '12px',
        marginBottom: '16px',
        borderRadius: '6px',
        border: '1px solid #CBD5E1',
        fontSize: '14px',
        width: '100%',
        boxSizing: 'border-box' // Crucial for flex layouts
    },
    primaryBtn: {
        backgroundColor: '#2563EB',
        color: 'white',
        border: 'none',
        padding: '12px',
        borderRadius: '6px',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '10px'
    }
};