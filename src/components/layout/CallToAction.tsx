import React from "react";

const CallToAction = () => {
    return (
        <section className="py-8 bg-gradient-to-r max-w-6xl m-auto from-blue-400 via-blue-500 to-blue-600 text-white text-center rounded-4xl">
            <div className="max-w-xl mx-auto px-2">
                <h2 className="text-2xl md:text-3xl font-extrabold mb-4 ">
                    Prêt à booster votre visibilité locale ?
                </h2>
                <p className="text-base mb-6 opacity-90">
                    Essayez Localink gratuitement et découvrez comment attirer plus de clients dès aujourd'hui.
                </p>
                <a
                    href="/demo"
                    className="inline-block px-8 py-3 rounded-full bg-white text-blue-600 font-bold text-base shadow-lg hover:bg-blue-100 hover:text-blue-700 transition-all border-2 border-white"
                >
                    Commencer avec la formule gratuite
                </a>
            </div>
        </section>
    );
};

export default CallToAction;