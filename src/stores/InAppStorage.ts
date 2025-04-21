export const Storage = {
    setItem: (itemKey: string, itemValue: any) => {
        if (typeof itemValue === "object") {
            itemValue = JSON.stringify(itemValue);
        }
        localStorage.setItem(itemKey, itemValue);
    },

    appendItem: (itemKey: string, itemValue: any) => {
        let initialItemValue = localStorage.getItem(itemKey);
        if (!initialItemValue) {
            initialItemValue = JSON.stringify([]);
            localStorage.setItem(itemKey, initialItemValue);
        }

        try {
            initialItemValue = JSON.parse(initialItemValue);
            if (Array.isArray(initialItemValue)) {
                initialItemValue.push(itemValue);
                localStorage.setItem(itemKey, JSON.stringify(initialItemValue));
            }
        } catch (err) {
            return initialItemValue;
        }
    },

    subtractItem: (itemKey: string, itemValue: any) => {
        let initialItemValue = localStorage.getItem(itemKey);
        if (!initialItemValue) return;

        try {
            initialItemValue = JSON.parse(initialItemValue);
            if (Array.isArray(initialItemValue)) {
                const filteredValues = initialItemValue.filter((val) => val.tab !== itemValue.tab);
                localStorage.setItem(itemKey, JSON.stringify(filteredValues || []));
            }
        } catch (err) {
            return initialItemValue;
        }
    },

    getItem: (itemKey: string) => {
        const itemValue = localStorage.getItem(itemKey);
        if (!itemValue) return;

        try {
            return JSON.parse(itemValue);
        } catch (err) {
            return itemValue;
        }
    },

    removeItem: (itemKey: string) => {
        localStorage.removeItem(itemKey);
    },

    clearItem: () => {
        localStorage.clear();
    },
};
