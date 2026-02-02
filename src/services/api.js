// API Service para conectar con el backend
const API_URL = 'http://localhost:3000/api';

// === PROPIETARIOS ===
export const propietariosApi = {
    getAll: async () => {
        const res = await fetch(`${API_URL}/propietarios`);
        if (!res.ok) throw new Error('Error al obtener propietarios');
        return res.json();
    },

    create: async (data) => {
        const res = await fetch(`${API_URL}/propietarios`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Error al crear propietario');
        }
        return res.json();
    },

    update: async (cedula, data) => {
        const res = await fetch(`${API_URL}/propietarios/${cedula}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Error al actualizar propietario');
        return res.json();
    },

    delete: async (cedula) => {
        const res = await fetch(`${API_URL}/propietarios/${cedula}`, {
            method: 'DELETE'
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Error al eliminar propietario');
        }
        return res.json();
    }
};

// === CASAS ===
export const casasApi = {
    getAll: async () => {
        const res = await fetch(`${API_URL}/casas`);
        if (!res.ok) throw new Error('Error al obtener casas');
        return res.json();
    },

    create: async (data) => {
        const res = await fetch(`${API_URL}/casas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Error al crear casa');
        }
        return res.json();
    },

    update: async (numero, data) => {
        const res = await fetch(`${API_URL}/casas/${numero}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Error al actualizar casa');
        return res.json();
    },

    delete: async (numero) => {
        const res = await fetch(`${API_URL}/casas/${numero}`, {
            method: 'DELETE'
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Error al eliminar casa');
        }
        return res.json();
    }
};

// === RECIBOS ===
export const recibosApi = {
    getAll: async () => {
        const res = await fetch(`${API_URL}/recibos`);
        if (!res.ok) throw new Error('Error al obtener recibos');
        return res.json();
    },

    getOne: async (nro) => {
        const res = await fetch(`${API_URL}/recibos/${nro}`);
        if (!res.ok) throw new Error('Error al obtener recibo');
        return res.json();
    },

    create: async (data) => {
        const res = await fetch(`${API_URL}/recibos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Error al crear recibo');
        }
        return res.json();
    },

    delete: async (nro) => {
        const res = await fetch(`${API_URL}/recibos/${nro}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error('Error al eliminar recibo');
        return res.json();
    }
};

// === GASTOS ===
export const gastosApi = {
    getAll: async () => {
        const res = await fetch(`${API_URL}/gastos`);
        if (!res.ok) throw new Error('Error al obtener gastos');
        return res.json();
    },

    create: async (data) => {
        const res = await fetch(`${API_URL}/gastos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Error al registrar gasto');
        return res.json();
    },

    delete: async (id) => {
        const res = await fetch(`${API_URL}/gastos/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error('Error al eliminar gasto');
        return res.json();
    }
};

// === CUOTAS MENSUALES ===
export const cuotasApi = {
    getAll: async () => {
        const res = await fetch(`${API_URL}/cuotas`);
        if (!res.ok) throw new Error('Error al obtener cuotas');
        return res.json();
    },

    create: async (data) => {
        const res = await fetch(`${API_URL}/cuotas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Error al crear cuota');
        }
        return res.json();
    },

    update: async (id, data) => {
        const res = await fetch(`${API_URL}/cuotas/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Error al actualizar cuota');
        return res.json();
    },

    delete: async (id) => {
        const res = await fetch(`${API_URL}/cuotas/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) throw new Error('Error al eliminar cuota');
        return res.json();
    },

    generarAnio: async (data) => {
        const res = await fetch(`${API_URL}/cuotas/generar-anio`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Error al generar cuotas del año');
        return res.json();
    }
};
