import React from 'react';

interface StatusBadgeProps {
    active: boolean;
    textActive?: string;
    textInactive?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
                                                            active,
                                                            textActive = 'Activo',
                                                            textInactive = 'Inactivo'
                                                        }) => {
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition ${
                active
                    ? 'bg-emerald-100/80 text-emerald-800 border-emerald-200'
                    : 'bg-rose-100/80 text-rose-800 border-rose-200'
            }`}
        >
      <span className={`h-2 w-2 rounded-full ${active ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            {active ? textActive : textInactive}
    </span>
    );
};