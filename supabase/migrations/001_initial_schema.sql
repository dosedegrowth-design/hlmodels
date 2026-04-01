-- HL Models - Initial Schema
-- Run this in the Supabase SQL Editor

-- Enum types
CREATE TYPE categoria_tipo AS ENUM ('homem', 'mulher', 'nao_binario');
CREATE TYPE foto_tipo AS ENUM ('book', 'polaroid', 'editorial');
CREATE TYPE candidatura_status AS ENUM ('pendente', 'analisando', 'aprovado', 'rejeitado');

-- Modelos table
CREATE TABLE modelos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  categoria categoria_tipo NOT NULL,
  foto_principal TEXT,
  altura TEXT,
  manequim TEXT,
  busto TEXT,
  cintura TEXT,
  quadril TEXT,
  calcado TEXT,
  olhos TEXT,
  cabelo TEXT,
  instagram TEXT,
  bio TEXT,
  ativo BOOLEAN DEFAULT true,
  destaque BOOLEAN DEFAULT false,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Modelo fotos table
CREATE TABLE modelo_fotos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  modelo_id UUID NOT NULL REFERENCES modelos(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  ordem INTEGER DEFAULT 0,
  tipo foto_tipo DEFAULT 'book',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Candidaturas table
CREATE TABLE candidaturas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  idade INTEGER,
  altura TEXT,
  cidade TEXT,
  instagram TEXT,
  fotos JSONB DEFAULT '[]'::jsonb,
  mensagem TEXT,
  status candidatura_status DEFAULT 'pendente',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Contatos table
CREATE TABLE contatos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  assunto TEXT,
  mensagem TEXT NOT NULL,
  lido BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_modelos_categoria ON modelos(categoria);
CREATE INDEX idx_modelos_ativo ON modelos(ativo);
CREATE INDEX idx_modelos_slug ON modelos(slug);
CREATE INDEX idx_modelos_destaque ON modelos(destaque);
CREATE INDEX idx_modelo_fotos_modelo_id ON modelo_fotos(modelo_id);
CREATE INDEX idx_candidaturas_status ON candidaturas(status);
CREATE INDEX idx_contatos_lido ON contatos(lido);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER modelos_updated_at
  BEFORE UPDATE ON modelos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS Policies

-- Modelos: public read for active models, admin write
ALTER TABLE modelos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active models"
  ON modelos FOR SELECT
  USING (ativo = true);

CREATE POLICY "Authenticated users can manage models"
  ON modelos FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Modelo fotos: public read, admin write
ALTER TABLE modelo_fotos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view model photos"
  ON modelo_fotos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM modelos WHERE modelos.id = modelo_fotos.modelo_id AND modelos.ativo = true
    )
  );

CREATE POLICY "Authenticated users can manage model photos"
  ON modelo_fotos FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Candidaturas: public insert, admin read/update
ALTER TABLE candidaturas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit candidaturas"
  ON candidaturas FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage candidaturas"
  ON candidaturas FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Contatos: public insert, admin read/update
ALTER TABLE contatos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contatos"
  ON contatos FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage contatos"
  ON contatos FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Storage: create bucket for model photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('modelos', 'modelos', true)
ON CONFLICT DO NOTHING;

-- Storage policy: public read
CREATE POLICY "Public can view model images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'modelos');

-- Storage policy: authenticated upload
CREATE POLICY "Authenticated can upload model images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'modelos');

CREATE POLICY "Authenticated can update model images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'modelos');

CREATE POLICY "Authenticated can delete model images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'modelos');
