PGDMP      /    
            }            dms    17.0    17.0                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false                       1262    27813    dms    DATABASE     v   CREATE DATABASE dms WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_India.1252';
    DROP DATABASE dms;
                     postgres    false            �            1259    27967    assignments    TABLE     �  CREATE TABLE public.assignments (
    id integer NOT NULL,
    orderid integer NOT NULL,
    partnerid integer,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(50) NOT NULL,
    reason text,
    CONSTRAINT assignments_status_check CHECK (((status)::text = ANY ((ARRAY['success'::character varying, 'failed'::character varying])::text[])))
);
    DROP TABLE public.assignments;
       public         heap r       postgres    false            �            1259    27966    assignments_id_seq    SEQUENCE     �   CREATE SEQUENCE public.assignments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.assignments_id_seq;
       public               postgres    false    222                       0    0    assignments_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.assignments_id_seq OWNED BY public.assignments.id;
          public               postgres    false    221            �            1259    27866    orders    TABLE     �  CREATE TABLE public.orders (
    _id integer NOT NULL,
    ordernumber character varying(50) NOT NULL,
    customer jsonb NOT NULL,
    area character varying(255) NOT NULL,
    items jsonb NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying,
    scheduledfor time without time zone NOT NULL,
    assignedto integer,
    totalamount numeric(10,2) NOT NULL,
    createdat timestamp without time zone DEFAULT now(),
    updatedat timestamp without time zone DEFAULT now(),
    CONSTRAINT orders_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'assigned'::character varying, 'picked'::character varying, 'delivered'::character varying])::text[])))
);
    DROP TABLE public.orders;
       public         heap r       postgres    false            �            1259    27865    orders__id_seq    SEQUENCE     �   CREATE SEQUENCE public.orders__id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.orders__id_seq;
       public               postgres    false    220                       0    0    orders__id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.orders__id_seq OWNED BY public.orders._id;
          public               postgres    false    219            �            1259    27833    partners    TABLE     `  CREATE TABLE public.partners (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(15) NOT NULL,
    status character varying(10),
    currentload integer DEFAULT 0,
    areas text[],
    shiftstart time without time zone,
    shiftend time without time zone,
    rating numeric(3,2) DEFAULT 0,
    completedorders integer DEFAULT 0,
    cancelledorders integer DEFAULT 0,
    CONSTRAINT partners_status_check CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying])::text[])))
);
    DROP TABLE public.partners;
       public         heap r       postgres    false            �            1259    27832    partners_id_seq    SEQUENCE     �   CREATE SEQUENCE public.partners_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.partners_id_seq;
       public               postgres    false    218                       0    0    partners_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.partners_id_seq OWNED BY public.partners.id;
          public               postgres    false    217            j           2604    27970    assignments id    DEFAULT     p   ALTER TABLE ONLY public.assignments ALTER COLUMN id SET DEFAULT nextval('public.assignments_id_seq'::regclass);
 =   ALTER TABLE public.assignments ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    221    222    222            f           2604    27869 
   orders _id    DEFAULT     h   ALTER TABLE ONLY public.orders ALTER COLUMN _id SET DEFAULT nextval('public.orders__id_seq'::regclass);
 9   ALTER TABLE public.orders ALTER COLUMN _id DROP DEFAULT;
       public               postgres    false    220    219    220            a           2604    27836    partners id    DEFAULT     j   ALTER TABLE ONLY public.partners ALTER COLUMN id SET DEFAULT nextval('public.partners_id_seq'::regclass);
 :   ALTER TABLE public.partners ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    217    218    218                      0    27967    assignments 
   TABLE DATA           Z   COPY public.assignments (id, orderid, partnerid, "timestamp", status, reason) FROM stdin;
    public               postgres    false    222   \(                 0    27866    orders 
   TABLE DATA           �   COPY public.orders (_id, ordernumber, customer, area, items, status, scheduledfor, assignedto, totalamount, createdat, updatedat) FROM stdin;
    public               postgres    false    220   �(                 0    27833    partners 
   TABLE DATA           �   COPY public.partners (id, name, email, phone, status, currentload, areas, shiftstart, shiftend, rating, completedorders, cancelledorders) FROM stdin;
    public               postgres    false    218   �)                  0    0    assignments_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.assignments_id_seq', 14, true);
          public               postgres    false    221                       0    0    orders__id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.orders__id_seq', 31, true);
          public               postgres    false    219                        0    0    partners_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.partners_id_seq', 20, true);
          public               postgres    false    217            z           2606    27976    assignments assignments_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.assignments DROP CONSTRAINT assignments_pkey;
       public                 postgres    false    222            v           2606    27879    orders orders_ordernumber_key 
   CONSTRAINT     _   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_ordernumber_key UNIQUE (ordernumber);
 G   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_ordernumber_key;
       public                 postgres    false    220            x           2606    27877    orders orders_pkey 
   CONSTRAINT     Q   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (_id);
 <   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_pkey;
       public                 postgres    false    220            p           2606    27847    partners partners_email_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.partners
    ADD CONSTRAINT partners_email_key UNIQUE (email);
 E   ALTER TABLE ONLY public.partners DROP CONSTRAINT partners_email_key;
       public                 postgres    false    218            r           2606    27849    partners partners_phone_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.partners
    ADD CONSTRAINT partners_phone_key UNIQUE (phone);
 E   ALTER TABLE ONLY public.partners DROP CONSTRAINT partners_phone_key;
       public                 postgres    false    218            t           2606    27845    partners partners_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.partners
    ADD CONSTRAINT partners_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.partners DROP CONSTRAINT partners_pkey;
       public                 postgres    false    218            |           2606    27977 $   assignments assignments_orderid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_orderid_fkey FOREIGN KEY (orderid) REFERENCES public.orders(_id) ON DELETE CASCADE;
 N   ALTER TABLE ONLY public.assignments DROP CONSTRAINT assignments_orderid_fkey;
       public               postgres    false    220    4728    222            }           2606    27982 &   assignments assignments_partnerid_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.assignments
    ADD CONSTRAINT assignments_partnerid_fkey FOREIGN KEY (partnerid) REFERENCES public.partners(id) ON DELETE CASCADE;
 P   ALTER TABLE ONLY public.assignments DROP CONSTRAINT assignments_partnerid_fkey;
       public               postgres    false    218    222    4724            {           2606    27880    orders orders_assignedto_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_assignedto_fkey FOREIGN KEY (assignedto) REFERENCES public.partners(id) ON DELETE SET NULL;
 G   ALTER TABLE ONLY public.orders DROP CONSTRAINT orders_assignedto_fkey;
       public               postgres    false    220    4724    218               P   x�U��� �3L�4�ǈ�	��N`��[���S��e�
䐞�v1��}�u�M�du��ƯG6IA��Y�����         �   x���Aj�0E��)�ֱY[�%z����� �[�����V��4��,f������%��}�L�(<e
����4��ap���e
��e�'
�g��+;Q�������5�>+�jj���)�i�|	��;��/�g�1�c��)�< ��e]:lA�8�XoP�����%A���F+���a���a�%�-���;��)����vR�N�������5O�i�O�#��         �   x�e��
�0F�������v��&[+��*t�"�۠�C>B�D	���#����N���Q���$<v�K�È#� tK-@��44��D���kr�2���Y \���>LQ�����a����\��39�*�Ǟ�<azg7� �T����,Z����r��p�c���J[     