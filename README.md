# Marcenaria Pro

Criar um sistema de orçamentos para marcenaria

WJMarcenaria o nome

onde vai inserir fotos, videos, gerar documento impresso, informações da pessoa ou empresa que esta contratando o serviço
Opção de adicionar imagem ou video e adicionar Observações e Condições





import React, { useState, useRef } from 'react';
import { 
  Printer, Plus, Trash2, Image as ImageIcon, FileVideo, 
  User, MapPin, Phone, Mail, FileText, Calendar, DollarSign,
  Camera, Info, Wallet, Percent, Truck, ImagePlus, Users, Search, Save
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('editor'); // 'editor' | 'preview' | 'clients'
  
  const [logo, setLogo] = useState(null);
  
  const [financials, setFinancials] = useState({ discount: 0, freight: 0 });
  const [payment, setPayment] = useState({ method: '', pixKey: '' });

  // Estado para os clientes salvos (Banco de Dados Local Simulado)
  const [savedClients, setSavedClients] = useState([
    { id: '1', name: 'João Silva', document: '111.222.333-44', phone: '(11) 98888-7777', email: 'joao@email.com', address: 'Rua das Flores, 123 - Centro' },
    { id: '2', name: 'Empresa ABC', document: '12.345.678/0001-99', phone: '(11) 3333-4444', email: 'contato@abc.com.br', address: 'Av. Paulista, 1000 - Bela Vista' }
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  // Estado para os dados do cliente no orçamento atual
  const [client, setClient] = useState({
    name: '',
    document: '', // CPF/CNPJ
    phone: '',
    email: '',
    address: ''
  });

  // Estado para os detalhes do projeto
  const [project, setProject] = useState({
    description: '',
    deliveryDate: '',
    notes: 'Validade do orçamento: 15 dias.\nCondições de pagamento: 50% no pedido, 50% na entrega.'
  });

  // Estado para os itens do orçamento
  const [items, setItems] = useState([
    { id: 1, description: '', quantity: 1, unitPrice: 0 }
  ]);

  // Estado para mídias (fotos e vídeos)
  const [mediaFiles, setMediaFiles] = useState([]);
  
  // Estado para Observações (se separado de project.notes)
  // Nota: Já existe project.notes, vamos garantir que ele seja o campo principal para isso.

  // Manipuladores de entrada de dados
  const handleClientChange = (e) => setClient({ ...client, [e.target.name]: e.target.value });
  const handleProjectChange = (e) => setProject({ ...project, [e.target.name]: e.target.value });

  // Funções da Aba de Clientes
  const saveClient = () => {
    if (!client.name) {
      alert("Por favor, preencha pelo menos o nome do cliente.");
      return;
    }
    const newClient = { ...client, id: Date.now().toString() };
    setSavedClients([...savedClients, newClient]);
    alert("Cliente salvo com sucesso!");
  };

  const selectClient = (selectedClient) => {
    setClient({
      name: selectedClient.name,
      document: selectedClient.document,
      phone: selectedClient.phone,
      email: selectedClient.email,
      address: selectedClient.address
    });
    setActiveTab('editor'); // Volta para o editor após selecionar
  };

  const deleteClient = (id) => {
    setSavedClients(savedClients.filter(c => c.id !== id));
  };

  const filteredClients = savedClients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.document.includes(searchTerm)
  );

  // Manipuladores de Itens
  const addItem = () => {
    setItems([...items, { id: Date.now(), description: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleItemChange = (id, field, value) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  };

  const calculateTotal = () => {
    const sub = calculateSubtotal();
    return sub + Number(financials.freight) - Number(financials.discount);
  };

  const handleLogoUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Manipuladores de Mídia
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newMedia = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'image',
      name: file.name
    }));
    setMediaFiles([...mediaFiles, ...newMedia]);
  };

  const removeMedia = (id) => {
    setMediaFiles(mediaFiles.filter(media => media.id !== id));
  };

  // Formatação de Moeda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    


      {/* Estilos para Impressão */}
      @media print {
          body * {
            visibility: hidden;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white;
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
          .page-break {
            page-break-before: always;
          }
        }
      `}

      {/* Cabeçalho do App (Não impresso) */}
      


        


          


            

WJ


            

Marcenaria


          


          


             setActiveTab('editor')}
              className={`px-3 py-2 rounded-md transition-colors whitespace-nowrap ${activeTab === 'editor' ? 'bg-amber-100 text-amber-900 font-medium' : 'hover:bg-amber-700/50'}`}
            >
              Editar Orçamento
            
             setActiveTab('clients')}
              className={`px-3 py-2 rounded-md transition-colors whitespace-nowrap flex items-center gap-1 ${activeTab === 'clients' ? 'bg-amber-100 text-amber-900 font-medium' : 'hover:bg-amber-700/50'}`}
            >
               Clientes
            
             setActiveTab('preview')}
              className={`px-3 py-2 rounded-md transition-colors whitespace-nowrap ${activeTab === 'preview' ? 'bg-amber-100 text-amber-900 font-medium' : 'hover:bg-amber-700/50'}`}
            >
              Visualizar PDF
            
          


        


      



      
        
        {/* ABA: EDITOR */}
        


          
          {/* Seção: Configurações Rápidas (Logo) */}
          


            


               {logo ? (
                 
               ) : (
                 

WJ


               )}
               


                 

Logo da sua Marcenaria


                 

Adicione sua marca para sair no cabeçalho da impressão.


               


            


            


              
              
                
                {logo ? 'Trocar Logo' : 'Inserir Logo'}
              
            


          



          {/* Seção: Dados do Cliente */}
          


            


              


                
                Dados do Cliente
              


              
                 Salvar Cliente
              
            


            


              


                Nome / Empresa
                
              


              


                CPF / CNPJ
                
              


              


                 Telefone
                
              


              


                 E-mail
                @email.com" />
              
              


                 Endereço da Obra/Entrega
                
              


            
          

          {/* Seção: Detalhes do Projeto e Itens */}
          


            


              
              Detalhes do Projeto
            


            
            


              


                Descrição Geral do Projeto
                
              


              


                 Prazo de Entrega Estimado
                
              


            



            


              


                Itens do Orçamento
              


              
              


                {items.map((item, index) => (
                  


                    


                      Descrição do Móvel/Serviço
                       handleItemChange(item.id, 'description', e.target.value)} 
                        className="w-full p-2 border rounded-md bg-white outline-none" 
                        placeholder="Ex: Armário superior MDF Branco..."
                      />
                    


                    


                      Qtd.
                       handleItemChange(item.id, 'quantity', Number(e.target.value))} 
                        className="w-full p-2 border rounded-md bg-white outline-none" 
                      />
                    


                    


                      Valor Unitário (R$)
                       handleItemChange(item.id, 'unitPrice', Number(e.target.value))} 
                        className="w-full p-2 border rounded-md bg-white outline-none" 
                      />
                    


                    


                      {formatCurrency(item.quantity * item.unitPrice)}
                    


                     removeItem(item.id)}
                      className="p-2 text-red-500 hover:bg-red-100 rounded-md transition-colors"
                      title="Remover item"
                    >
                      
                    
                  


                ))}
              



              
                 Adicionar Novo Item
              
            


            
            


              


                Valor Total:
                {formatCurrency(calculateTotal())}
              


            


          



          {/* Seção: Valores Adicionais e Pagamento */}
          


            


              
              Valores Adicionais e Pagamento
            


            


              


                 Frete / Instalação (R$)
                 setFinancials({...financials, freight: Number(e.target.value)})} 
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-amber-500 outline-none" 
                  placeholder="0,00"
                />
              


              


                 Desconto (R$)
                 setFinancials({...financials, discount: Number(e.target.value)})} 
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-amber-500 outline-none" 
                  placeholder="0,00"
                />
              


              


                Forma de Pagamento
                 setPayment({...payment, method: e.target.value})} 
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-amber-500 outline-none" 
                  placeholder="Ex: 50% PIX, 50% Cartão" 
                />
              


              


                Chave PIX (Opcional)
                 setPayment({...payment, pixKey: e.target.value})} 
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-amber-500 outline-none font-mono" 
                  placeholder="Sua chave PIX" 
                />
              


            


          



          {/* Seção: Mídias (Fotos/Vídeos) */}
          


            


              
              Adicionar Fotos e Vídeos (Projetos 3D, Referências)
            


            
            


              
              
                


                  
                


                Clique aqui para inserir fotos ou vídeos
                Formatos aceitos: Imagens (JPG, PNG) e Vídeos (MP4, WebM)
              
            



            {mediaFiles.length > 0 && (
              


                {mediaFiles.map((media) => (
                  


                    {media.type === 'image' ? (
                      
                    ) : (
                      


                        
                        {media.name}
                        Vídeo
                      


                    )}
                     removeMedia(media.id)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-700"
                      title="Remover mídia"
                    >
                      
                    
                  


                ))}
              


            )}
          



          {/* Seção: Observações e Condições */}
          


            


              
              Observações e Condições Gerais
            


            


              Insira abaixo os termos do orçamento, como validade, formas de pagamento, garantia e outras informações importantes para o cliente.
            


            
          



        

        {/* ABA: CLIENTES (Cadastro e Pesquisa) */}
        


          


            


              


                
                Sua Lista de Clientes
              


              
              


                
                 setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-slate-50"
                />
              


            



            


              {filteredClients.length > 0 ? (
                filteredClients.map(c => (
                  


                    


                      

{c.name}


                      

 {c.document || 'Sem documento'}


                      

 {c.phone || 'Sem telefone'}


                    


                    


                       deleteClient(c.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Excluir"
                      >
                        
                      
                       selectClient(c)}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
                      >
                        Usar no Orçamento
                      
                    


                  


                ))
              ) : (
                


                  Nenhum cliente encontrado.
                


              )}
            


          


        



        {/* ABA: VISUALIZAÇÃO / IMPRESSÃO */}
        


          


             window.print()}
              className="flex items-center gap-2 bg-amber-800 hover:bg-amber-900 text-white px-6 py-3 rounded-lg font-medium shadow-md transition-colors"
            >
              
              Gerar PDF / Imprimir
            
          



          {/* ÁREA DE IMPRESSÃO (Folha A4 mock) */}
          


            
            {/* Cabeçalho do Documento */}
            


              


                {logo ? (
                  
                ) : (
                  


                    WJ
                  


                )}
                


                  

WJ Marcenaria


                  

Móveis Planejados & Sob Medida


                


              


              


                

Orçamento


                

Data: {new Date().toLocaleDateString('pt-BR')}


              


            



            {/* Dados do Cliente */}
            


              

Para:


              


                

Cliente: {client.name || 'Não informado'}


                

CPF/CNPJ: {client.document || 'Não informado'}


                

Telefone: {client.phone || 'Não informado'}


                

E-mail: {client.email || 'Não informado'}


                

Endereço: {client.address || 'Não informado'}


              


            



            {/* Detalhes do Projeto */}
            


              

Detalhes do Projeto


              

{project.description || 'Nenhuma descrição fornecida.'}


              

Prazo de Entrega: {project.deliveryDate || 'A combinar'}


            



            {/* Tabela de Itens */}
            


              
                  {items.map((item, idx) => (
                    
                  ))}
                
                  {financials.freight > 0 && (
                    
                  )}
                  {financials.discount > 0 && (
                    
                  )}
                  


                
                  
                    Item / Descrição
                    Qtd.
                    V. Unitário
                    Subtotal
                  
                
                
                      {item.description || `Item ${idx + 1}`}
                      {item.quantity}
                      {formatCurrency(item.unitPrice)}
                      {formatCurrency(item.quantity * item.unitPrice)}
                    
                


                  
                    Subtotal dos Itens:
                    {formatCurrency(calculateSubtotal())}
                  
                      Frete / Instalação:
                      +{formatCurrency(financials.freight)}
                    
                      Desconto:
                      -{formatCurrency(financials.discount)}
                    
                    Total do Orçamento:
                    {formatCurrency(calculateTotal())}
                  
                


              


            



            {/* Informações de Pagamento (Condicional) */}
            {(payment.method || payment.pixKey) && (
              


                {payment.method && (
                  


                     Forma de Pagamento
                    {payment.method}
                  


                )}
                {payment.pixKey && (
                  


                    Pagamento via PIX
                    
                      {payment.pixKey}
                    
                  


                )}
              


            )}

            {/* Observações */}
            {project.notes && (
              


                


                  
                  Observações e Condições
                


                

{project.notes}


              


            )}

            {/* Mídias (Apenas imagens na impressão) */}
            {mediaFiles.length > 0 && (
              


                

Anexos / Referências do Projeto


                


                  {mediaFiles.map((media) => (
                    media.type === 'image' ? (
                      


                        
                      


                    ) : (
                      


                         


                           
                         


                         

Arquivo de vídeo anexado ao projeto original


                         

{media.name}


                      


                    )
                  ))}
                


              


            )}

            {/* Assinatura */}
            


              


                


                

WJ Marcenaria


                

Contratado


              


              


                


                

{client.name || 'Assinatura do Cliente'}


                

Contratante


              


            



          


        



      
    
  );
}

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/03392c7b-7047-4f9d-8080-b293fd4ed75f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
