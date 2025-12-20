import { useState, useRef } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Trash2, Plus, Download } from "lucide-react";

interface EPIItem {
  id: string;
  dataEntrega: string;
  qtd: string;
  descricao: string;
  certificadoCA: string;
  nomeComercial: string;
  assinatura: string;
}

interface FormData {
  colaborador: string;
  cpf: string;
  unidade: string;
  admissao: string;
  cargo: string;
  setor: string;
  supervisor: string;
  dataDemissao: string;
}

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
    colaborador: "",
    cpf: "",
    unidade: "",
    admissao: "",
    cargo: "",
    setor: "",
    supervisor: "",
    dataDemissao: "",
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return "_".repeat(10);
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR'); // DD/MM/YYYY
  };

  const epiData: Record<string, { nomeComercial: string; certificadoCA: string }> = {
    LUVA: { nomeComercial: "MEDIX", certificadoCA: "44396" },
    MÁSCARA: { nomeComercial: "ECOMAX", certificadoCA: "81359800024" },
    AVENTAL: { nomeComercial: "MEDIX", certificadoCA: "80495510128" },
    TOUCA: { nomeComercial: "DEJAMARO", certificadoCA: "81605660003" },
  };

  const [epiItems, setEpiItems] = useState<EPIItem[]>([
    {
      id: "1",
      dataEntrega: "",
      qtd: "",
      descricao: "",
      certificadoCA: "",
      nomeComercial: "",
      assinatura: "",
    },
  ]);

  const pdfRef = useRef<HTMLDivElement>(null);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEpiChange = (id: string, field: string, value: string) => {
    setEpiItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleDescricaoChange = (id: string, value: string) => {
    const data = epiData[value];
    setEpiItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              descricao: value,
              nomeComercial: data ? data.nomeComercial : "",
              certificadoCA: data ? data.certificadoCA : "",
            }
          : item
      )
    );
  };

  const addEpiRow = () => {
    const newId = Date.now().toString();
    setEpiItems((prev) => [
      ...prev,
      {
        id: newId,
        dataEntrega: "",
        qtd: "",
        descricao: "",
        certificadoCA: "",
        nomeComercial: "",
        assinatura: "",
      },
    ]);
  };

  const removeEpiRow = (id: string) => {
    if (epiItems.length > 1) {
      setEpiItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const generatePDF = () => {
    if (!pdfRef.current) return;

    const printWindow = window.open("", "", "height=800,width=1000");
    if (!printWindow) {
      alert("Por favor, desabilite o bloqueador de pop-ups para gerar o PDF");
      return;
    }

    const htmlContent = pdfRef.current.innerHTML;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Termo de Responsabilidade de EPI</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: Arial, sans-serif;
            font-size: 10px;
            padding: 8px;
            line-height: 1.2;
          }
          .page {
            max-width: 210mm;
            margin: 0 auto;
            background: white;
            page-break-after: always;
          }
          .header-box {
            border: 2px solid #000;
            padding: 12px;
            margin-bottom: 0;
            display: flex;
            align-items: center;
            gap: 15px;
          }
          .logo {
            width: 70px;
            height: 50px;
            flex-shrink: 0;
          }
          .header-content {
            flex: 1;
            text-align: center;
          }
          .header-content h1 {
            font-size: 14px;
            font-weight: bold;
            margin: 0;
            text-decoration: underline;
          }
          .header-content p {
            font-size: 12px;
            margin: 2px 0 0 0;
            font-weight: bold;
          }
          .section-title {
            font-size: 14px;
            font-weight: bold;
            text-align: center;
            padding: 8px;
            border: 1px solid #000;
            border-top: none;
            background-color: #fff;
          }
          .company-info {
            border: 1px solid #000;
            border-top: none;
            padding: 10px;
            font-size: 10px;
            line-height: 1.5;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }
          .company-info p {
            margin: 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10px;
            margin-bottom: 0;
          }
          th, td {
            border: 1px solid #000;
            padding: 6px;
            text-align: center;
          }
          th {
            background-color: #fff;
            font-weight: bold;
          }
          .declaration {
            font-size: 12px;
            margin-bottom: 0;
            text-align: justify;
            line-height: 1.3;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0;
          }
          .declaration-left {
            border: 1px solid #000;
            padding: 8px;
            border-right: none;
          }
          .declaration-right {
            border: 1px solid #000;
            padding: 8px;
          }
          .signature-section {
            margin-top: 15px;
            padding: 0 8px;
            font-size: 8px;
            text-align: center;
          }
          .signature-line {
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
          }
          .signature-item {
            text-align: center;
            width: 45%;
          }
          .line {
            border-top: 1px solid #000;
            margin-top: 15px;
            padding-top: 3px;
          }
          .epi-table-container {
            margin: 0;
          }
          .epi-table-title {
            font-size: 9px;
            font-weight: bold;
            margin-bottom: 0;
            font-style: italic;
            padding: 4px 8px;
            border: 1px solid #000;
            border-bottom: none;
          }
          .footer {
            font-size: 10px;
            margin-top: 10px;
            text-align: center;
          }
          @page {
            size: A4 landscape;
          }
          @media print {
            body {
              padding: 0;
            }
            .page {
              max-width: 297mm;
              margin: 0 auto;
              background: white;
            }
          }
        </style>
      </head>
      <body>
        <div class="page">
          ${htmlContent}
        </div>
        <script>
          window.print();
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Termo de Responsabilidade de EPI
          </h1>
          <p className="text-slate-600">
            Preencha os dados do funcionário e os itens de EPI fornecidos
          </p>
        </div>

        {/* Card Principal */}
        <Card className="shadow-lg border-slate-200">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <CardTitle className="text-2xl">
              Qualificação do Funcionário
            </CardTitle>
          </CardHeader>

          <CardContent className="p-8">
            {/* Formulário de Dados do Funcionário */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Colaborador *
                </label>
                <Input
                  type="text"
                  name="colaborador"
                  value={formData.colaborador}
                  onChange={handleFormChange}
                  placeholder="Nome completo"
                  className="border-slate-300"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  CPF *
                </label>
                <Input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleFormChange}
                  placeholder="000.000.000-00"
                  className="border-slate-300"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Unidade *
                </label>
                <Input
                  type="text"
                  name="unidade"
                  value={formData.unidade}
                  onChange={handleFormChange}
                  placeholder="Unidade"
                  className="border-slate-300"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Admissão *
                </label>
                <Input
                  type="date"
                  name="admissao"
                  value={formData.admissao}
                  onChange={handleFormChange}
                  className="border-slate-300"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Cargo *
                </label>
                <Input
                  type="text"
                  name="cargo"
                  value={formData.cargo}
                  onChange={handleFormChange}
                  placeholder="Cargo"
                  className="border-slate-300"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Setor *
                </label>
                <Input
                  type="text"
                  name="setor"
                  value={formData.setor}
                  onChange={handleFormChange}
                  placeholder="Setor"
                  className="border-slate-300"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Supervisor(a) *
                </label>
                <Input
                  type="text"
                  name="supervisor"
                  value={formData.supervisor}
                  onChange={handleFormChange}
                  placeholder="Nome do supervisor"
                  className="border-slate-300"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Data da Demissão
                </label>
                <Input
                  type="date"
                  name="dataDemissao"
                  value={formData.dataDemissao}
                  onChange={handleFormChange}
                  className="border-slate-300"
                />
              </div>
            </div>

            {/* Tabela de EPIs */}
            <div className="mt-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-900">
                  Itens de Proteção Individual
                </h2>
                <Button
                  onClick={addEpiRow}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Item
                </Button>
              </div>

              <div className="overflow-x-auto border border-slate-300 rounded-lg">
                <table className="w-full border-collapse">
                  <thead className="bg-slate-200">
                    <tr>
                      <th className="border border-slate-300 p-3 text-center text-sm font-semibold text-slate-900">
                        Data Entrega
                      </th>
                      <th className="border border-slate-300 p-3 text-center text-sm font-semibold text-slate-900">
                        QTD
                      </th>
                      <th className="border border-slate-300 p-3 text-center text-sm font-semibold text-slate-900">
                        Descrição
                      </th>
                      <th className="border border-slate-300 p-3 text-center text-sm font-semibold text-slate-900">
                        Certificado CA
                      </th>
                      <th className="border border-slate-300 p-3 text-center text-sm font-semibold text-slate-900">
                        Nome Comercial
                      </th>
                      <th className="border border-slate-300 p-3 text-center text-sm font-semibold text-slate-900">
                        Assinatura
                      </th>
                      <th className="border border-slate-300 p-3 text-center text-sm font-semibold text-slate-900">
                        Ação
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {epiItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="border border-slate-300 p-2">
                          <Input
                            type="date"
                            value={item.dataEntrega}
                            onChange={(e) =>
                              handleEpiChange(
                                item.id,
                                "dataEntrega",
                                e.target.value
                              )
                            }
                            className="border-slate-300 text-sm"
                          />
                        </td>
                        <td className="border border-slate-300 p-2">
                          <Input
                            type="text"
                            value={item.qtd}
                            onChange={(e) =>
                              handleEpiChange(item.id, "qtd", e.target.value)
                            }
                            placeholder="Qtd"
                            className="border-slate-300 text-sm"
                          />
                        </td>
                        <td className="border border-slate-300 p-2">
                          <Select value={item.descricao} onValueChange={(value) => handleDescricaoChange(item.id, value)}>
                            <SelectTrigger className="border-slate-300 text-sm w-full">
                              <SelectValue placeholder="Selecione..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="LUVA">LUVA</SelectItem>
                              <SelectItem value="MÁSCARA">MÁSCARA</SelectItem>
                              <SelectItem value="AVENTAL">AVENTAL</SelectItem>
                              <SelectItem value="TOUCA">TOUCA</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="border border-slate-300 p-2">
                          <Input
                            type="text"
                            value={item.certificadoCA}
                            onChange={(e) =>
                              handleEpiChange(
                                item.id,
                                "certificadoCA",
                                e.target.value
                              )
                            }
                            placeholder="CA"
                            className="border-slate-300 text-sm"
                          />
                        </td>
                        <td className="border border-slate-300 p-2">
                          <Input
                            type="text"
                            value={item.nomeComercial}
                            onChange={(e) =>
                              handleEpiChange(
                                item.id,
                                "nomeComercial",
                                e.target.value
                              )
                            }
                            placeholder="Nome"
                            className="border-slate-300 text-sm"
                          />
                        </td>
                        <td className="border border-slate-300 p-2">
                          <Input
                            type="text"
                            value={item.assinatura}
                            onChange={(e) =>
                              handleEpiChange(
                                item.id,
                                "assinatura",
                                e.target.value
                              )
                            }
                            placeholder="Assinatura"
                            className="border-slate-300 text-sm"
                          />
                        </td>
                        <td className="border border-slate-300 p-2 text-center">
                          <button
                            onClick={() => removeEpiRow(item.id)}
                            disabled={epiItems.length === 1}
                            className="text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Botão de Exportar PDF */}
            <div className="mt-8 flex justify-end">
              <Button
                onClick={generatePDF}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Exportar em PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Elemento oculto para renderização do PDF */}
        <div ref={pdfRef} className="hidden">
          {/* Cabeçalho com Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", border: "2px solid #000", padding: "8px", marginBottom: "0" }}>
            {/* Logo */}
            <img src="/logo.jpg" alt="Logo" style={{ width: "6cm", height: "2cm", flexShrink: 0, marginLeft: "30px" }} />
            
            {/* Texto do Cabeçalho */}
            <div style={{ flex: 1, textAlign: "center" }}>
              <h1 style={{ fontSize: "14px", fontWeight: "bold", margin: "0", textDecoration: "underline" }}>
                TERMO DE RESPONSABILIDADE
              </h1>
              <p style={{ fontSize: "10px", margin: "2px 0 0 0", fontWeight: "bold" }}>
                FORNECIMENTO E USO DE EPI - EQUIPAMENTO DE PROTEÇÃO INDIVIDUAL DE USO ÚNICO
              </p>
            </div>
          </div>

          {/* Qualificação da Empresa */}
          <div style={{ border: "1px solid #000", borderTop: "none" }}>
            <div style={{ fontSize: "11px", fontWeight: "bold", textAlign: "center", padding: "6px", borderBottom: "1px solid #000", backgroundColor: "#fff" }}>
              QUALIFICAÇÃO DA EMPRESA
            </div>
            <div style={{ padding: "8px", fontSize: "10px", lineHeight: "1.5", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <p style={{ margin: "0" }}><strong>Empresa:</strong> LABORATÓRIOS REUNIDOS S/A</p>
                <p style={{ margin: "0" }}><strong>Endereço:</strong> Rua Monsenhor Coutinho, 490</p>
                <p style={{ margin: "0" }}><strong>Cidade:</strong> Manaus</p>
              </div>
              <div>
                <p style={{ margin: "0" }}><strong>CPNJ:</strong> 04.528.386/0001-60</p>
                <p style={{ margin: "0" }}><strong>Bairro:</strong> Centro</p>
                <p style={{ margin: "0" }}><strong>UF:</strong> AM</p>
              </div>
            </div>
          </div>

          {/* Qualificação do Funcionário */}
          <div style={{ border: "1px solid #000", borderTop: "none" }}>
            <div style={{ fontSize: "14px", fontWeight: "bold", textAlign: "center", padding: "6px", borderBottom: "1px solid #000", backgroundColor: "#fff" }}>
              QUALIFICAÇÃO DO FUNCIONÁRIO
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px" }}>
              <tbody>
                <tr>
                  <td style={{ border: "1px solid #000", padding: "5px", width: "25%" }}>
                    <strong>Colaborador</strong><br/>{formData.colaborador || "_".repeat(30)}
                  </td>
                  <td style={{ border: "1px solid #000", padding: "5px", width: "25%" }}>
                    <strong>CPF</strong><br/>{formData.cpf || "_".repeat(20)}
                  </td>
                  <td style={{ border: "1px solid #000", padding: "5px", width: "25%" }}>
                    <strong>Unidade</strong><br/>{formData.unidade || "_".repeat(20)}
                  </td>
                  <td style={{ border: "1px solid #000", padding: "5px", width: "25%" }}>
                    <strong>Admissão</strong><br/>{formatDate(formData.admissao)}
                  </td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid #000", padding: "5px", width: "25%" }}>
                    <strong>Cargo</strong><br/>{formData.cargo || "_".repeat(20)}
                  </td>
                  <td style={{ border: "1px solid #000", padding: "5px", width: "25%" }}>
                    <strong>Setor</strong><br/>{formData.setor || "_".repeat(20)}
                  </td>
                  <td style={{ border: "1px solid #000", padding: "5px", width: "25%" }}>
                    <strong>Supervisor (a)</strong><br/>{formData.supervisor || "_".repeat(20)}
                  </td>
                  <td style={{ border: "1px solid #000", padding: "5px", width: "25%" }}>
                    <strong>Data da Demissão</strong><br/>{formatDate(formData.dataDemissao)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Declaração */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0", border: "1px solid #000", borderTop: "none" }}>
            <div style={{ borderRight: "1px solid #000", padding: "6px", fontSize: "10px", textAlign: "justify", lineHeight: "1.3" }}>
              <p style={{ margin: "0 0 6px 0" }}>
                <strong>DECLARO,</strong> para os devidos fins, ter recebido o(s) Equipamento(s) de Proteção Individual - EPIs, abaixo descritos, os quais <strong>COMPROMETO-ME</strong> a utilizar durante a realização das minhas atividades. Declaro ainda que:
              </p>
              <p style={{ margin: "0 0 3px 0" }}>A) Os EPIs deverão ser utilizados unicamente para a finalidade a qual destinam-se;</p>
              <p style={{ margin: "0 0 3px 0" }}>B) Qualquer alteração que os torne parcial ou totalmente inadequados para o uso deverá ser por mim comunicado;</p>
              <p style={{ margin: "0 0 6px 0" }}>C) <strong>RESPONSABILIZO-ME</strong> pela guarda, conservação e uso correto dos EPIs que me foram entregues. A falta de uso, por mim, dos EPIs fornecidos pelo <strong>LABORATÓRIOS REUNIDOS DA AMAZÔNIA S/A,</strong> constitui ato falso sujeito às sanções disciplinares previstas na <strong>Legislação CLT</strong> e no <strong>Regulamento Interno da Empresa,</strong> aplicáveis ao assunto (art. 158 da Lei Federal nº 6.514/77);</p>
              <p style={{ margin: "0 0 3px 0" }}>D) Em caso de perda, extravio ou inutilização proposital, as competências de Superior Hierárquico, Setor de Segurança do Trabalho e/ou Setor de Recursos Humanos aplicará notificação disciplinar e/ou tomará as medidas cabíveis sujeitos às sanções disciplinares previstas na <strong>Legislação CLT</strong> e no <strong>Regulamento Interno da Empresa,</strong> aplicáveis ao assunto, inclusive a demissão por justa causa (art. 462, parágrafo 1º da CLT).</p>
              <p style={{ margin: "0 0 4px 0", fontSize: "10px" }}>
                <strong>Base Legal:</strong><br/>
                Instrução Normativa do Município;<br/>
                NR1 (aprovada pela portaria MTb 3.214, de 08/06/78), Item 1.4.2 - Cabe ao trabalhador:<br/>
                A) Cumprir as disposições legais e regulamentares sobre segurança e saúde no trabalho, inclusive as ordens de serviço expedidas pelo empregador;
              </p>
            </div>
            <div style={{ padding: "6px", fontSize: "10px", textAlign: "justify", lineHeight: "1.3" }}>
              <p style={{ margin: "0 0 3px 0" }}>B) Submeter-se aos exames médicos previstos nas NR;</p>
              <p style={{ margin: "0 0 3px 0" }}>C) Colaborar com a organização na aplicação das NR; e</p>
              <p style={{ margin: "0 0 3px 0" }}>D) Usar o equipamento de proteção individual fornecido pelo empregador;</p>
              <p style={{ margin: "0 0 6px 0" }}>E) Constituiu ato falso e recusa injustificada do empregado ao cumprimento do disposto nas alinhas do subitem anterior.</p>
              <p style={{ margin: "0 0 6px 0" }}>NR6 (aprovada pela portaria MTb nº 3.214, de 08/06/78), Item 6.6.1 - Responsabilidade do Trabalhador sobre o EPI:</p>
              <p style={{ margin: "0 0 3px 0" }}>A) Usar o fornecido pela organização;</p>
              <p style={{ margin: "0 0 3px 0" }}>B) Utilizar apenas para a finalidade a que se destina;</p>
              <p style={{ margin: "0 0 3px 0" }}>C) Responsabilizar-se pela limpeza, guarda e conservação;</p>
              <p style={{ margin: "0 0 3px 0" }}>D) Comunicar à organização quando extraviado, danificado ou qualquer alteração que o torne impróprio para uso; e</p>
              <p style={{ margin: "0 0 6px 0" }}>E) Cumprir as determinações da organização sobre o uso adequado.</p>
              <p style={{ margin: "0 0 8px 0", fontSize: "10px" }}>Finalmente, declaro que estou de acordo com todos os termos presentes, razão pela qual assino, nesta data, por livre e espontânea vontade.</p>
              <div style={{ marginTop: "12px", textAlign: "center" }}>
                <p style={{ margin: "0 0 15px 0", fontSize: "10px" }}>___/___/___</p>
                <p style={{ margin: "0", fontSize: "10px" }}>Data</p>
                <div style={{ borderTop: "1px solid #000", marginTop: "15px", paddingTop: "3px" }}>
                  <p style={{ margin: "0", fontSize: "10px" }}>Assinatura do colaborador(a)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabela de EPIs */}
          <div style={{ border: "1px solid #000", borderTop: "none" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid #000", padding: "4px", width: "12%", fontWeight: "bold", fontStyle: "italic", textAlign: "center" }}>Data Entrega</th>
                  <th style={{ border: "1px solid #000", padding: "4px", width: "8%", fontWeight: "bold", fontStyle: "italic", textAlign: "center" }}>QTD</th>
                  <th style={{ border: "1px solid #000", padding: "4px", width: "20%", fontWeight: "bold", fontStyle: "italic", textAlign: "center" }}>Descrição</th>
                  <th style={{ border: "1px solid #000", padding: "4px", width: "15%", fontWeight: "bold", fontStyle: "italic", textAlign: "center" }}>Certificado de Aprovação (CA)</th>
                  <th style={{ border: "1px solid #000", padding: "4px", width: "25%", fontWeight: "bold", fontStyle: "italic", textAlign: "center" }}>Nome Comercial do produto</th>
                  <th style={{ border: "1px solid #000", padding: "4px", width: "20%", fontWeight: "bold", fontStyle: "italic", textAlign: "center" }}>Assinatura do Colaborador</th>
                </tr>
              </thead>
              <tbody>
                {epiItems.map((item) => (
                  <tr key={item.id}>
                    <td style={{ border: "1px solid #000", padding: "4px", minHeight: "20px" }}>{formatDate(item.dataEntrega)}</td>
                    <td style={{ border: "1px solid #000", padding: "4px", minHeight: "20px" }}>{item.qtd}</td>
                    <td style={{ border: "1px solid #000", padding: "4px", minHeight: "20px" }}>{item.descricao}</td>
                    <td style={{ border: "1px solid #000", padding: "4px", minHeight: "20px" }}>{item.certificadoCA}</td>
                    <td style={{ border: "1px solid #000", padding: "4px", minHeight: "20px" }}>{item.nomeComercial}</td>
                    <td style={{ border: "1px solid #000", padding: "4px", minHeight: "20px" }}>{item.assinatura}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Rodapé */}
          <div style={{ fontSize: "10px", marginTop: "8px", textAlign: "left" }}>
            FOR-RH-001. Rev. 01
          </div>
        </div>
      </div>
    </div>
  );
}
