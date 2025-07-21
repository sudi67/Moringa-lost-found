// Sample data for demonstration
export const sampleItems = [
    {
        id: 1,
        name: "iPhone 13 Pro",
        category: "electronics",
        status: "found",
        description: "Black iPhone 13 Pro found near the cafeteria. Screen has minor scratches but fully functional.",
        location: "Cafeteria",
        date: "2024-01-15",
        contact: "found@moringaschool.com",
        image: "https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=iPhone+13+Pro"
    },
    {
        id: 2,
        name: "Student ID Card",
        category: "documents",
        status: "lost",
        description: "Lost my student ID card somewhere between the library and main building. Name: John Doe.",
        location: "Library to Main Building",
        date: "2024-01-14",
        contact: "john.doe@student.moringaschool.com",
        image: "https://via.placeholder.com/300x200/10B981/FFFFFF?text=Student+ID"
    },
    {
        id: 3,
        name: "Black Backpack",
        category: "accessories",
        status: "found",
        description: "Black Jansport backpack with laptop compartment. Contains some textbooks and a water bottle.",
        location: "Gymnasium",
        date: "2024-01-13",
        contact: "security@moringaschool.com",
        image: "https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Backpack"
    },
    {
        id: 4,
        name: "MacBook Air",
        category: "electronics",
        status: "lost",
        description: "Silver MacBook Air 2022 model. Has stickers on the back. Last seen in the study area.",
        location: "Study Area",
        date: "2024-01-12",
        contact: "jane.smith@student.moringaschool.com",
        image: "https://via.placeholder.com/300x200/EF4444/FFFFFF?text=MacBook+Air"
    },
    {
        id: 5,
        name: "Water Bottle",
        category: "accessories",
        status: "found",
        description: "Blue Hydro Flask water bottle with stickers. Found in the parking lot.",
        location: "Parking Lot",
        date: "2024-01-11",
        contact: "maintenance@moringaschool.com",
        image: "https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=Water+Bottle"
    },
    {
        id: 6,
        name: "Textbook Set",
        category: "books",
        status: "lost",
        description: "Set of programming textbooks: JavaScript, Python, and Data Structures. In a blue bag.",
        location: "Classroom 205",
        date: "2024-01-10",
        contact: "mike.wilson@student.moringaschool.com",
        image: "https://via.placeholder.com/300x200/06B6D4/FFFFFF?text=Textbooks"
    }
];

// Utility functions
export const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

export const getStatusClass = (status) => {
    return status === 'lost' ? 'status-lost' : 'status-found';
};

export const capitalizeFirst = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
