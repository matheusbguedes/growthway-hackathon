"use client";

import Calendar from "./(components)/calendar";

export default function Agenda() {
    return (
        <div className="container mx-auto my-3 px-6 py-6 md:px-8 space-y-5 border border-border rounded-xl">
            <Calendar />
        </div>
    );
}