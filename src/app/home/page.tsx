import Sidebar from "@/components/sidebar";

const Home = () => {
    return (
        <div className="flex min-h-screen">
            <Sidebar />

            <main className="flex-1 bg-gray-50 p-6 md:p-8 lg:p-12">
                {/* Page Header */}
                <header className="mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Bem-vindo à Home Page da Gastécnica!</h1>
                    <p className="text-lg text-gray-600">
                        Aqui você encontra uma visão geral do sistema e pode acessar todas as funcionalidades disponíveis.
                        Explore o menu à esquerda para navegar pelas diferentes seções.
                    </p>
                </header>

                {/* Main Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Últimos Atendimentos</h2>
                        <p className="text-gray-600 flex-1">Confira os atendimentos recentes e acompanhe o status de cada um.</p>
                        <a href="#" className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                            Ver mais
                        </a>
                    </div>
                    {/* Card 2 */}
                    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Relatórios</h2>
                        <p className="text-gray-600 flex-1">Gerencie e visualize relatórios detalhados sobre os atendimentos e outros dados relevantes.</p>
                        <a href="#" className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                            Ver mais
                        </a>
                    </div>
                    {/* Card 3 (Optional) */}
                    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Notificações</h2>
                        <p className="text-gray-600 flex-1">Receba e gerencie notificações importantes diretamente daqui.</p>
                        <a href="#" className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                            Ver mais
                        </a>
                    </div>
                </div>

                {/* Call to Action Button */}
                <div className="mt-8 flex justify-center">
                    <button className="bg-custom-blue text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                        Orçamento Rápido
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Home;
