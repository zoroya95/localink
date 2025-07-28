"use client";

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ImQuotesLeft, ImQuotesRight } from "react-icons/im";

type Testimonial = {
    quote: string;
    name: string;
    designation: string;
    src: string;
};

export const AnimatedTestimonials = ({
    testimonials,
    autoplay = false,
}: {
    testimonials: Testimonial[];
    autoplay?: boolean;
}) => {
    const [active, setActive] = useState(0);
    const [direction, setDirection] = useState<"left" | "right">("right");

    const handleNext = () => {
        setDirection("right");
        setActive((prev) => (prev + 1) % testimonials.length);
    };

    const handlePrev = () => {
        setDirection("left");
        setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    useEffect(() => {
        if (autoplay) {
            const interval = setInterval(handleNext, 5000);
            return () => clearInterval(interval);
        }
    }, [autoplay]);

    return (
        <div className="mx-auto max-w-7xl px-4 py-12 md:py-20">
            <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-stretch lg:gap-24">
                {/* Partie image - Nouveau style */}
                <div className="relative h-96 w-full max-w-md lg:h-[480px]">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={active}
                            custom={direction}
                            initial={{ opacity: 0, x: direction === "right" ? 100 : -100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: direction === "right" ? -100 : 100 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="absolute inset-0 h-full w-full"
                        >
                            <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-2xl">
                                <img
                                    src={testimonials[active].src}
                                    alt={testimonials[active].name}
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                    <h3 className="text-2xl font-bold">
                                        {testimonials[active].name}
                                    </h3>
                                    <p className="text-blue-200">
                                        {testimonials[active].designation}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Miniatures */}
                    <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-2">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setDirection(index > active ? "right" : "left");
                                    setActive(index);
                                }}
                                className={`h-2 w-8 rounded-full transition-all duration-300 ${index === active ? "bg-blue-500 w-12" : "bg-gray-300"}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Partie texte */}
                <div className="flex flex-1 flex-col justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={active}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="max-w-lg"
                        >
                            <div className="relative">
                                
                                <p className="text-2xl font-medium leading-relaxed text-gray-800 md:text-3xl">
                                    {testimonials[active].quote}
                                </p>
                                
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Contrôles */}
                    <div className="mt-12 flex items-center justify-between">
                        <div className="flex gap-2">
                            <button
                                onClick={handlePrev}
                                className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md transition-all hover:bg-gray-50 hover:shadow-lg"
                            >
                                <IconArrowLeft className="h-5 w-5 text-gray-700" />
                            </button>
                            <button
                                onClick={handleNext}
                                className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md transition-all hover:bg-gray-50 hover:shadow-lg"
                            >
                                <IconArrowRight className="h-5 w-5 text-gray-700" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};