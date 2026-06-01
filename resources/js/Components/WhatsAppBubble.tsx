import { Phone } from 'lucide-react';

export function WhatsAppBubble() {
    return (
        <a
            href="https://wa.me/6281289886013"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 left-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            aria-label="Chat WhatsApp"
        >
            {/* Menggunakan icon Phone dari Lucide karena icon khusus WhatsApp butuh library terpisah, tapi kita buat terlihat identik dengan gaya WA */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-8 h-8"
            >
                <path d="M12.031 0C5.385 0 0 5.384 0 12.031c0 2.632.827 5.093 2.234 7.158L.484 24l5.006-1.745A11.968 11.968 0 0 0 12.031 24c6.645 0 12.03-5.384 12.03-12.031S18.676 0 12.031 0zm5.955 17.202c-.276.776-1.583 1.488-2.186 1.547-.6.059-1.341.222-4.185-.96-3.415-1.417-5.632-4.908-5.803-5.137-.17-.23-1.385-1.841-1.385-3.513 0-1.671.865-2.502 1.171-2.834.306-.33.666-.412.887-.412.222 0 .445.002.639.01.206.01.482-.078.753.57.276.657.944 2.302 1.028 2.468.083.165.138.358.028.57-.11.213-.166.345-.333.543-.166.197-.348.423-.497.558-.166.15-.341.314-.148.646.194.331.861 1.42 1.843 2.296 1.272 1.134 2.33 1.484 2.662 1.633.332.15.526.126.721-.097.194-.223.834-1.025 1.056-1.378.221-.352.443-.294.747-.18s1.942.915 2.274 1.08c.331.165.553.246.636.386.082.139.082.808-.194 1.583z"/>
            </svg>
            
            {/* Tooltip on hover */}
            <span className="absolute left-16 bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-lg shadow border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Hubungi Kami via WhatsApp
            </span>
        </a>
    );
}
